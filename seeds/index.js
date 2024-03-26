// This file is used to clear the resto-find database and to seed it with sample
// restaurants in the beginning.

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

        const resto = new Restaurant({
            title: `${rand_element(prefixes)} ${rand_element(suffixes)}`,
            location: `${cities[rand].city}, ${cities[rand].state}`
        });

        await resto.save();
    }
};

// Since an async function returns a promise, therefore this closes the
// connection to MongoDB after the seed_db() function returns.
seed_db().then(() => {
    db.close();
});
