// To require (i.e. import) the express module and to create an express server.
// The app object will have methods for routing HTTP requests, rendering HTML
// response pages, etc.
const express = require("express");
const app = express();

app.listen(3000, () => {
    console.log("Serving on port 3000!");
})
