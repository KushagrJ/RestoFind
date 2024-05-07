const express = require("express");
const router = express.Router();

// This imports the Mongoose model exported in the restaurant.js file.
const Restaurant = require("../models/restaurant");

const { is_logged_in, validate_restaurant, is_existing_restaurant, is_author } =
    require("../utils/middleware-functions");

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

// Multiple middleware functions can be chained one after another.
router.get("/new", is_logged_in, (req, res) => {
    res.render("restaurants/new");
});

router.post("/", is_logged_in, validate_restaurant, async (req, res, next) => {
    try {
        const restaurant = new Restaurant(req.body.restaurant);
        restaurant.author = req.user._id;
        await restaurant.save();

        req.flash("success", "Successfully created a new restaurant!");

        // This redirects to the specified path. The method may be either GET or
        // POST, depending upon the situation.
        res.redirect(`/restaurants/${restaurant._id}`);
    } catch (err) {
        next(err);
    }
});

// The order in which these routes have been defined matters.
router.get("/:id", is_existing_restaurant, async (req, res, next) => {
    try {
        // populate("reviews") populates the reviews array in the returned
        // document (object) from the restaurants collection with the
        // corresponding data from the reviews collection.
        await res.locals.restaurant.populate("reviews");
        await res.locals.restaurant.populate("author");

        res.render("restaurants/show", { restaurant: res.locals.restaurant });
    } catch (err) {
        next(err);
    }
});

router.get("/:id/edit", is_logged_in, is_existing_restaurant, is_author,
    (req, res, next) => {
        res.render("restaurants/edit", { restaurant: res.locals.restaurant });
    });

router.put("/:id", is_logged_in, is_existing_restaurant, is_author,
    validate_restaurant, async (req, res, next) => {
        try {
            const restaurant = await
                Restaurant.findByIdAndUpdate(req.params.id,
                    req.body.restaurant);

            req.flash("success", "Successfully updated the restaurant!");
            res.redirect(`/restaurants/${restaurant._id}`);
        } catch (err) {
            next(err);
        }
    });

router.delete("/:id", is_logged_in, is_existing_restaurant, is_author,
    async (req, res, next) => {
        try {
            await Restaurant.findByIdAndDelete(req.params.id);
            req.flash("success", "Successfully deleted the restaurant!");
            res.redirect("/restaurants");
        } catch (err) {
            next(err);
        }
    });

module.exports = router;
