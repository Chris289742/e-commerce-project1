import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../services/email.js";
import { validationResult } from "express-validator";

//~ These APIs is session-based authentication.

export const getLogin = (req, res) => {
    let successMessage = req.flash("success");

    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        successMessage: successMessage.length > 0 ? successMessage[0] : null,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

export const postLogin = async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    const errors = validationResult(req);
    
    // Debug logging
    console.log('Login attempt - Email:', email, 'Password:', password);
    console.log('Validation errors:', errors.array());
    
    try {
        if (!errors.isEmpty()) {
            console.log('Rendering with validation errors:', errors.array());
            return res.status(422).render("auth/login", {
                pageTitle: "Login",
                path: "/login",
                successMessage: null,
                oldInput: {
                    email: email,
                    password: password,
                },
                validationErrors: errors.array(),
            });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(422).render("auth/login", {
                pageTitle: "Login",
                path: "/login",
                successMessage: null,
                oldInput: {
                    email: email,
                    password: password,
                },
                validationErrors: [{ path: 'email', msg: 'User not found' }],
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
                console.log(err);
                res.redirect("/products");
            });
        }
        return res.status(422).render("auth/login", {
            pageTitle: "Login",
            path: "/login",
            successMessage: null,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: [{ path: 'password', msg: 'Invalid password' }],
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).render("auth/login", {
            pageTitle: "Login",
            path: "/login",
            successMessage: null,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: [{ path: 'email', msg: 'Something went wrong. Please try again.' }],
        });
    }
};

export const postLogout = (req, res) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};

export const getSignup = (req, res) => {
    res.render("signup", {
        pageTitle: "Sign Up",
        path: "/signup",
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    });
};

export const postSignup = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    
    // Check for validation errors
    if (!errors.isEmpty()) {
        return res.status(422).render("signup", {
            pageTitle: "Sign Up",
            path: "/signup",
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        });
    }

    try {
        // Hash the password and save the user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            email: email,
            password: hashedPassword,
        });
        await newUser.save();

        // Send welcome email
        await sendWelcomeEmail(email);

        // redirect to login page with success message
        req.flash("success", "Signup successful! Please log in.");
        res.redirect("/login");
    } catch (error) {
        console.error("Error during signup:", error);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/signup");
    }
};

const authUtils = { getLogin, postLogin, postLogout, getSignup, postSignup };

export default authUtils;
