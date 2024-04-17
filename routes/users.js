const express = require("express");
const router = express.Router();

const passport = require("passport");

const User = require("../models/user");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // To use Passport, we create a new user without the password property,
        // and then call User.register() with the password.
        // Passport will hash the password using a salt and then save the
        // document to the collection.
        const user = new User({ email, username });
        await User.register(user, password);

        req.flash("success",
            "Successfully created a new user! Welcome to RestoFind!");

        res.redirect("/restaurants");
    } catch (err) {
        // This code will be reached, for eg., when either username or email is
        // not unique.
        req.flash("error", err.message);
        res.redirect("/register");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

// passport.authenticate() manipulates the req.session object to log a user in.
router.post("/login",
    passport.authenticate("local", {
        // This causes a "Password or username is incorrect" error flash message
        // to get displayed upon a login failure.
        failureFlash: true,

        // This redirects to "/login" upon a login failure.
        failureRedirect: "/login"
    }), (req, res) => {
        req.flash("success",
            "Successfully logged you in! Welcome back to RestoFind!");

        res.redirect("/restaurants");
    });

module.exports = router;
