const express = require("express");
const router = express.Router();

// This imports the Mongoose model exported in the restaurant.js file.
const Restaurant = require("../models/restaurant");

const ExpressError = require("../utils/express-error");
const { RestaurantValidationSchema } = require("../utils/validation-schemas");

router.get("/", async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find({});

        // This makes the restaurants variable (which refers to the array
        // containing every restaurant document (object)) available in the
        // index.ejs file.
        res.render("restaurants/index", { restaurants });
    } catch (err) {
        next(err);
    }
});

router.get("/new", (req, res) => {
    res.render("restaurants/new");
});

const validate_restaurant = (req, res, next) => {
    // If the validation is successful, then error will be undefined.
    const { error } = RestaurantValidationSchema.validate(req.body);

    if (error) {
        // error.details is an array of objects with each object having a
        // message property. This creates a single message by joining them.
        const message = error.details.map(el => el.message).join(", ");

        throw new ExpressError(400, message);
    } else {
        next();
    }
};

// Multiple middleware functions can be chained one after another.
router.post("/", validate_restaurant, async (req, res, next) => {
    try {
        const restaurant = new Restaurant(req.body.restaurant);
        await restaurant.save();

        req.flash("success", "Successfully created a new restaurant!");

        // This redirects to the specified path.
        res.redirect(`/restaurants/${restaurant._id}`);
    } catch (err) {
        next(err);
    }
});

// The order in which these routes have been defined matters.
router.get("/:id", async (req, res, next) => {
    try {
        // The id in the path can be accessed using req.params.id.
        // populate("reviews") populates the reviews array in the returned
        // document (object) from the restaurants collection with the
        // corresponding data from the reviews collection.
        const restaurant =
            await Restaurant.findById(req.params.id).populate("reviews");

        // If req.params.id is not a valid 12-byte hexadecimal string (since
        // MongoDB ObjectId's are 12-byte hexadecimal strings), then the above
        // findById() will throw an error and this code will not be reached.
        if (!restaurant) {
            // This code will be reached only when req.params.id is a valid
            // 12-byte hexadecimal string and it doesn't correspond to any
            // actual document, as in this case, Mongoose will not throw any
            // error and will simply leave restaurant as undefined.
            req.flash("error", "Couldn't find that restaurant!");
            res.redirect("/restaurants");
        } else {
            res.render("restaurants/show", { restaurant });
        }
    } catch (err) {
        next(err);
    }
});

router.get("/:id/edit", async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            req.flash("error", "Couldn't find that restaurant!");
            res.redirect("/restaurants");
        } else {
            res.render("restaurants/edit", { restaurant });
        }
    } catch (err) {
        next(err);
    }
});

router.put("/:id", validate_restaurant, async (req, res, next) => {
    try {
        const restaurant = await
            Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant);
        req.flash("success", "Successfully updated the restaurant!");
        res.redirect(`/restaurants/${restaurant._id}`);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        req.flash("success", "Successfully deleted the restaurant!");
        res.redirect("/restaurants");
    } catch (err) {
        next(err);
    }
});

module.exports = router;
