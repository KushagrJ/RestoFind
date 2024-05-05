module.exports.is_logged_in = (req, res, next) => {
    // req.isAuthenticated(), which is provided by Passport, checks the
    // req.session object to know whether a user is authenticated (logged in)
    // with respect to the current session.
    if (!req.isAuthenticated()) {
        // It should be noted that req.session, like req.flash, persists across
        // multiple request-response cycles, whereas res.locals persists only
        // during the current request-response cycle.
        // req.originalUrl, as opposed to req.path, also contains the prefix
        // defined in the app.js file.
        req.session.return_to = req.originalUrl;

        req.flash("error", "You must be logged in!");
        res.redirect("/login");
    } else {
        next();
    }
};

// Since Passport clears the session after a successful login, therefore
// req.session.return_to will no longer exist after a successful login attempt
// has been made.
// So, before logging in (i.e. before the session gets cleared), this middleware
// function is executed to store the return_to url within res.locals.
module.exports.store_return_to = (req, res, next) => {
    if (req.session.return_to) {
        res.locals.return_to = req.session.return_to;
    }

    next();
};
