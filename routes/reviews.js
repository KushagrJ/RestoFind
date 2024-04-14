const express = require("express");
const router = express.Router({ mergeParams: true });

// Setting mergeParams to true allows, for eg., the :id specified in the prefix
// in app.js to be used in this file.

const Restaurant = require("../models/restaurant");
const Review = require("../models/review");
const ExpressError = require("../utils/express-error");
const { ReviewValidationSchema } = require("../utils/validation-schemas");

const validate_review = (req, res, next) => {
    const { error } = ReviewValidationSchema.validate(req.body);

    if (error) {
        const message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, message);
    } else {
        next();
    }
};

router.post("/", validate_review, async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        const review = new Review(req.body.review);

        // Even though it looks like the entire review gets pushed, only the
        // object id of the review actually gets pushed, as the
        // RestaurantSchema has been defined in this way.
        restaurant.reviews.push(review);

        await restaurant.save();
        await review.save();

        req.flash("success", "Successfully created a new review!");

        res.redirect(`/restaurants/${restaurant._id}`)
    } catch (err) {
        next(err);
    }
});

router.delete("/:review_id", async (req, res, next) => {
    try {
        // This deletes all occurrences of review_id from the reviews array
        // within the corresponding restaurants document.
        await Restaurant.findByIdAndUpdate(req.params.id,
            { $pull: { reviews: req.params.review_id } });

        await Review.findByIdAndDelete(req.params.review_id);

        req.flash("success", "Successfully deleted the review!");

        res.redirect(`/restaurants/${req.params.id}`);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
