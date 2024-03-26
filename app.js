// This requires (i.e. imports) the Express module and creates an Express
// server.
// The (commonly named) app object has methods for routing incoming HTTP
// requests, rendering HTML pages as HTTP responses, etc.
const express = require("express");
const app = express();

// This imports the path module, which provides utilities for working with file
// and directory paths.
const path = require("path");

// This imports the Mongoose module.
const mongoose = require("mongoose");

// This imports the model exported in the restaurant.js file.
const Restaurant = require("./models/restaurant");

// This connects Mongoose to the MongoDB database called resto-find.
// There is no need to await mongoose.connect() because Mongoose buffers the
// function calls related to Mongoose models internally.
mongoose.connect("mongodb://127.0.0.1:27017/resto-find");

// Instead of using mongoose.connection, you can now use db.
const db = mongoose.connection;

// This is used to know whether the connection to MongoDB was successfully
// established.
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!");
});

// This allows you to render HTML pages (using ejs templates) as HTTP responses.
// Also, this causes express to import the ejs module internally, and you can
// omit the extension (for eg., home instead of home.ejs).
app.set("view engine", "ejs");

// This tells express that the view (ejs template) files are located in the
// views directory within RestoFind.
app.set("views", path.join(__dirname, "views"));

// express.urlencoded() is a built-in middleware which populates the req.body
// object according to the incoming post/put/etc. request's data.
app.use(express.urlencoded({ extended: true }));

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

app.get("/restaurants", async (req, res) => {
    const restaurants = await Restaurant.find({});

    // This makes the restaurants variable (which refers to the array containing
    // every restaurant document (object)) available in the index.ejs file.
    res.render("restaurants/index", { restaurants });
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

app.get("/restaurants/new", (req, res) => {
    res.render("restaurants/new");
});

app.post("/restaurants", async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();

    // This redirects to the specified path.
    res.redirect(`/restaurants/${restaurant._id}`);
});

// The order in which these routes have been defined matters.
app.get("/restaurants/:id", async (req, res) => {
    // The id in the path can be accessed using req.params.id.
    const restaurant = await Restaurant.findById(req.params.id);

    res.render("restaurants/show", { restaurant });
});

// This starts up the server on port 3000 and invokes the specified callback
// function.
app.listen(3000, () => {
    console.log("Serving on port 3000!");
});
