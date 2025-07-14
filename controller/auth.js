import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const getLogin = (req, res) => {
    let errorMessage = req.flash("error");
    let successMessage = req.flash("success");

    res.render("login", {
        pageTitle: "Login",
        path: "/login",
        errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
        successMessage: successMessage.length > 0 ? successMessage[0] : null,
    });
};

export const postLogin = async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/login");
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
        req.flash("error", "Invalid password");
        res.redirect("/login");
    } catch (error) {
        console.error("Error during login:", error);
        req.flash("error", "Something went wrong");
        res.redirect("/login");
    }
};

export const postLogout = (req, res) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};

export const getSignup = (req, res) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("signup", {
        pageTitle: "Sign Up",
        path: "/signup",
        errorMessage: message,
    });
};

export const postSignup = async (req, res) => {
    // get the password & email info
    try {
        const { email, password } = req.body;
        // fetch the user from the db
        const existingUser = await User.findOne({ email: email });
        // if user exists, return error
        if (existingUser) {
            req.flash("error", "The user has existed!");
            return res.redirect("/signup");
        }
        // if not, hash the password and save the user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
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
