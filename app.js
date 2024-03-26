// This requires (i.e. imports) the express module and creates an express
// server.
// The (commonly named) app object has methods for routing incoming HTTP
// requests, rendering HTML pages as HTTP responses, etc.
const express = require("express");
const app = express();

// This imports the path module, which provides utilities for working with file
// and directory paths.
const path = require("path");

// This imports the mongoose module.
const mongoose = require("mongoose");

// This imports the model exported in the file restaurant.js.
const Restaurant = require("./models/restaurant")

// This connects Mongoose to the MongoDB database called resto-find.
mongoose.connect("mongodb://127.0.0.1:27017/resto-find");

// Instead of using mongoose.connection, you can now use db.
const db = mongoose.connection;

// This is used to know whether the connection to MongoDB was successfully
// established.
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!");
})

// This allows you to render HTML pages (using ejs templates) as HTTP responses.
// Also, this causes express to import the ejs module internally, and you can
// omit the extension (for eg., home instead of home.ejs).
app.set("view engine", "ejs");

// This tells express that the view (ejs template) files are located in the
// views directory within RestoFind.
app.set("views", path.join(__dirname, "views"));

// This invokes the specified callback function whenever there is an HTTP GET
// request with a path "/" relative to the website's root.
// The callback function takes 2 arguments, commonly named as req and res, which
// are both provided by express.
// req is an object containing information about the corresponding incoming HTTP
// request, and res is an object which can be used to send back the desired HTTP
// response.
app.get("/", (req, res) => {
    // // This sends back the specified string as the HTTP response.
    // res.send("HELLO FROM RESTO FIND!");

    // This renders and sends back the specified HTML page (home.ejs) as the
    // HTTP response.
    res.render("home");
});

// app.get("/makerestaurant", async (req, res) => {
//     // This creates a new Mongoose document.
//     const restaurant = new Restaurant({
//         title: "Bobby Snacks",
//         description: "Best Paneer Chilli in Asansol"
//     });

//     // This saves the specified Mongoose document to MongoDB as a MongoDB
//     // document within the restaurants MongoDB collection.
//     await restaurant.save();

//     res.send(restaurant);
// });

// This starts up the server on port 3000 and invokes the specified callback
// function.
app.listen(3000, () => {
    console.log("Serving on port 3000!");
});
