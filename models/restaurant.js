const mongoose = require("mongoose");

// Instead of using mongoose.Schema, you can now use Schema.
const Schema = mongoose.Schema;

// This creates a Mongoose schema.
const RestaurantSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

// module.exports is used to export stuff, which can then be imported in other
// JavaScript files.
// mongoose.model() creates and returns a Mongoose model (which is an object
// constructor) (according to the specified Mongoose schema) which maps to a
// MongoDB collection.
// A MongoDB database consists of MongoDB collections, and a MongoDB collection
// consists of MongoDB documents.
// A 'collection' of 'documents' in MongoDB is analogous to a 'table' of 'rows'
// in a relational database.
// In this case, the name of the corresponding MongoDB collection will be
// restaurants (i.e. the plural, lowercased version of Restaurant).
// An instance of a Mongoose model is called a Mongoose document, which maps to
// a MongoDB document.
module.exports = mongoose.model("Restaurant", RestaurantSchema);
