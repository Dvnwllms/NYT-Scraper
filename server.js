// Set dependencies //
var express = require("express");
var body = require("body-parser");
var exhbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");

// These two dependencies make scraping possible //
var cheerio = require("cheerio");
var request = require("request");

// Require all models //
var db = require("./models");

// Set active port //
var PORT = 3000;

// Initialize express //
var app = express();

// Set up middleware //

// Use the morgan logger package for logging requests //
app.use(logger("dev"));

// Use body-parser package for handling form submissions //
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static package to push to the public folder //
app.use(express.static("public"));

// Activate the handlebars struggle //
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Set up for Heroku deployment? Still confused on this //
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Set home route (Simple message to not have page blank) //
app.get("/", function(req, res) {
    res.send("Don't be mad at me if you get caught scraping bruh");
});

// Set app to listen/run on port 3000 //
app.listen(3000, function() {
    console.log("App running on port 3000!");
  });