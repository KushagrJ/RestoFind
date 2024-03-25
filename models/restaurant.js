const mongoose = require("mongoose");

// Instead of using mongoose.Schema, you can now use Schema.
const Schema = mongoose.Schema;

// This creates a mongoose schema.
const RestaurantSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

// This exports the specified object, which can then be imported in another
// JavaScript file.
// mongoose.model creates and returns a model (object) (according to the
// specified schema) which maps to a MongoDB collection.
// A MongoDB database consists of collections, while a collection consists of
// documents.
// In this case, the name of the corresponding MongoDB collection will be
// restaurants (i.e. the plural, lowercased version of Restaurant).
// An instance of a model is called a document, which maps to a MongoDB
// document.
module.exports = mongoose.model("Restaurant", RestaurantSchema);
