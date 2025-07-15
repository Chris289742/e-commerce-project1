import express from "express";

import { body, check } from "express-validator";

import authUtils from "../controller/auth.js";
import User from "../models/user.js";
const router = express.Router();

router.get("/login", authUtils.getLogin);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email address.") //!the message is only for last validation error
            .normalizeEmail({
                gmail_remove_dots: false, // Do not remove dots from Gmail addresses
                gmail_remove_subaddress: false, // Do not remove subaddressing from Gmail addresses. like not test+xxx@gmail.com to test@gmail.com
            }),

        body("password", "Password has to be valid.")
            .isLength({ min: 5 })
            .isAlphanumeric() // Check if the password is only having numbers and letters
            .trim(), // Remove leading and trailing spaces
        //~ This message applies to the first failing validator in the chain.
        //~ In this case, if `isLength({ min: 5 })` fails, the message will show.
        //~ If it passes but `isAlphanumeric()` fails, the same message is shown for that failure.
    ],
    authUtils.postLogin
);
router.get("/signup", authUtils.getSignup);

router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom(async (value, { req }) => {
                // .custom supports returning a Promise
                const userDoc = await User.findOne({ email: value });
                if (userDoc) {
                    return Promise.reject(
                        "E-Mail exists already, please pick a different one."
                    );
                }
            })
            .normalizeEmail(), // ~.custom((value, { req, location, path }) => { ... })
        body(
            "password",
            "Please enter a password with only numbers and text and at least 5 characters."
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body("confirmPassword")
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords have to match!");
                }
                return true;
            }),
    ],
    authUtils.postSignup
);
router.post("/logout", authUtils.postLogout);

export default router;
