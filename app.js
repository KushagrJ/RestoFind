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

// This imports the method-override module.
const method_override = require("method-override");

// This imports the ejs-mate module.
const ejs_mate = require("ejs-mate");

// This imports the model exported in the restaurant.js file.
const Restaurant = require("./models/restaurant");

const ExpressError = require("./utils/ExpressError");

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

// ejs-mate allows you to reuse the same ejs partial template across multiple
// views. This is similar to ejs partials, and both (ejs-mate and ejs partials)
// can be used simultaneously.
app.engine("ejs", ejs_mate);

// express.urlencoded() returns a built-in middleware function which populates
// the req.body object according to the incoming HTTP POST/PUT/etc. request's
// data.
app.use(express.urlencoded({ extended: true }));

// method_override() returns a middleware function which lets you use HTTP verbs
// such as PUT or DELETE in places where the client doesn't support it.
// For eg., you can only send a GET request or a POST request via an HTML form.
app.use(method_override("_method"));

// app.use() is generally used for introducing middlewares, and can handle all
// types of HTTP requests.
// On the other hand, for eg., app.get() can only handle HTTP GET requests.

// If no path is specified as the first argument of an app.use(), then the
// specified middleware function gets called for every HTTP request.
// However, if a path is specified as the first argument of an app.use(),
// for eg., "/book", then the corresponding middleware function gets called for
// every request with a path starting with "/book" relative to the website's
// root, for eg., "/book", "/book/1", "/book/page/index", etc.
// So, in other words, if no path is specified as the first argument of an
// app.use(), then "/" becomes the default value for the path argument.
// On the other hand, for eg., app.get() only calls the corresponding middleware
// function for those HTTP GET requests with a path exactly matching its first
// argument.

// This calls the specified middleware function whenever there is an HTTP GET
// request with a path "/".
// The middleware function takes multiple arguments, commonly named as req, res,
// etc., which are all provided by Express.
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

// Within a middleware function which does not end the request-response cycle
// (for eg., by using res.send(), res.render(), res.redirect(), etc.), we use
// the next() function (without any arguments) to execute the next middleware
// function in line.
// However, if an error argument is passed to next(), for eg., next(err), then
// all remaining middleware functions in the chain are skipped except for those
// that are correspondingly set up to handle that error.

// To handle errors within asynchronous functions, we must pass them to the
// next() function, where Express will catch and process them if no
// corresponding middleware functions have been set up to handle those errors.
// However, errors that occur within synchronous functions require no extra
// work. Express will automatically catch and process them if no corresponding
// middleware functions have been set up to handle those errors.
// Express' built-in error handling middleware function is added at the end of
// the middleware function stack.
app.get("/restaurants", async (req, res, next) => {
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

// app.get("/makerestaurant", async (req, res, next) => {
//     try {
//         // This creates a new Mongoose document.
//         const restaurant = new Restaurant({
//             title: "Bobby Snacks",
//             description: "Best Paneer Chilli in Asansol"
//         });

//         // This saves the specified Mongoose document to MongoDB as a MongoDB
//         // document within the restaurants MongoDB collection.
//         await restaurant.save();

//         res.send(restaurant);
//     } catch (err) {
//         next(err);
//     }
// });

app.get("/restaurants/new", (req, res) => {
    res.render("restaurants/new");
});

app.post("/restaurants", async (req, res, next) => {
    try {
        if (!(req.body.restaurant)) {
            throw new ExpressError(400, "Invalid restaurant data");
        }

        const restaurant = new Restaurant(req.body.restaurant);
        await restaurant.save();

        // This redirects to the specified path.
        res.redirect(`/restaurants/${restaurant._id}`);
    } catch (err) {
        next(err);
    }
});

// The order in which these routes have been defined matters.
app.get("/restaurants/:id", async (req, res, next) => {
    try {
        // The id in the path can be accessed using req.params.id.
        const restaurant = await Restaurant.findById(req.params.id);

        res.render("restaurants/show", { restaurant });
    } catch (err) {
        next(err);
    }
});

app.get("/restaurants/:id/edit", async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        res.render("restaurants/edit", { restaurant });
    } catch (err) {
        next(err);
    }
});

app.put("/restaurants/:id", async (req, res, next) => {
    try {
        const restaurant = await
            Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant);

        res.redirect(`/restaurants/${restaurant._id}`);
    } catch (err) {
        next(err);
    }
});

app.delete("/restaurants/:id", async (req, res, next) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.redirect("/restaurants");
    } catch (err) {
        next(err);
    }
});

// app.all() calls the specified middleware function whenever there is any HTTP
// request with the specified path. "*" is a wildcard path which matches every
// path.
// There is no meaningful difference between app.use(fn) (or app.use("/", fn))
// and app.all("*", fn). However, for other paths, as described above, app.use()
// matches any path that starts with the specified path, whereas app.all() only
// matches exact paths.
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error-handling middleware functions have four arguments: err, req, res and
// next.
app.use((err, req, res, next) => {
    // This sets default values for statusCode and message when destructuring in
    // case they are undefined.
    const { statusCode = 500, message = "Something went wrong" } = err;

    res.status(statusCode);
    res.send(message);
});

// This starts up the server on port 3000 and invokes the specified callback
// function.
app.listen(3000, () => {
    console.log("Serving on port 3000!");
});
