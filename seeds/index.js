// This file is used to clear the resto-find database and to seed it with sample
// restaurants in the beginning.

// source.unsplash.com can be used to get free, but not necessarily unique,
// images.
// Here, the images don't get stored in the database, and only the url does,
// which means that new images will get displayed every time the pages are
// loaded.

const mongoose = require("mongoose");
const Restaurant = require("../models/restaurant");
const cities = require("./cities");
const { prefixes, suffixes } = require("./helper");

mongoose.connect("mongodb://127.0.0.1:27017/resto-find");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!");
});

const rand_element = array => array[Math.floor(Math.random() * array.length)];

const seed_db = async () => {
    await Restaurant.deleteMany({});

    for (let i = 0; i < 50; ++i) {
        // Because there are 1000 cities in cities.js.
        const rand = Math.floor(Math.random() * 1000);

        const restaurant = new Restaurant({
            title: `${rand_element(prefixes)} ${rand_element(suffixes)}`,
            image: "https://source.unsplash.com/collection/483251",
            price: Math.floor(Math.random() * 900) + 100,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit fuga praesentium recusandae, provident ex aut libero quaerat.Maxime sint nulla amet nesciunt officiis earum, laudantium hic consectetur ducimus fugit dolores.",
            location: `${cities[rand].city}, ${cities[rand].state}`,

            // This is the id of the user "kushagrj", found by using mongosh.
            author: "6620362e9c1f3b028c5d36b3"
        });

        await restaurant.save();
    }
};

// Since an async function returns a promise, therefore this closes the
// connection to MongoDB after the seed_db() function returns and the returned
// promise is resolved.
seed_db().then(() => {
    db.close();
});
