const mongoose = require("mongoose");

// Instead of using mongoose.Schema, we can now use Schema.
const Schema = mongoose.Schema;

// This creates a Mongoose schema.
const RestaurantSchema = new Schema({
    title: String,
    location: String,
    image: String,
    price: Number,
    description: String,

    // reviews will be an array of object id's referring to documents from the
    // reviews MongoDB collection.
    // This is one way to implement a one-to-many relationship between MongoDB
    // collections.
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = require("./review");

// This is an eg. of a Mongoose middleware, which is different from an Express
// middleware.
// When the findOneAndDelete() method is called on a Mongoose model, then this
// makes the specified middleware function get called after (as this is a post,
// not pre, middleware) the job of findOneAndDelete() is done.
// Also, the specified middleware function gets passed the deleted Mongoose
// document as an argument, which may be null in case the document to be deleted
// wasn't found (no errors are thrown in this case).
// Since findByIdAndDelete() internally calls findOneAndDelete(), therefore we
// are attaching the specified middleware function to findOneAndDelete().
// Here, an arrow function is not used to potentially avoid future problems
// because arrow functions treat the this keyword differently.
RestaurantSchema.post("findOneAndDelete", async function (restaurant) {
    if (restaurant) {
        // This deletes every reviews document whose _id is present in the
        // reviews array within the corresponding restaurants document (which
        // has already been deleted by now).
        await Review.deleteMany({ _id: { $in: restaurant.reviews } });
    }
});

// module.exports is used to export stuff, which can then be imported in other
// JavaScript files.
// mongoose.model() creates and returns a Mongoose model (which, like classes,
// can be used to construct objects) (according to the specified Mongoose
// schema) which maps to a MongoDB collection.
// A MongoDB database consists of MongoDB collections, and a MongoDB collection
// consists of MongoDB documents.
// A 'collection' of 'documents' in MongoDB is analogous to a 'table' of 'rows'
// in a relational database.
// In this case, the name of the corresponding MongoDB collection will be
// restaurants (i.e. the plural, lowercased version of Restaurant).
// An instance of a Mongoose model is called a Mongoose document (which is an
// object) which maps to a MongoDB document.
module.exports = mongoose.model("Restaurant", RestaurantSchema);
