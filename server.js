// Set dependencies //
var express = require("express");
var body = require("body-parser");
var exhbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");

// These two dependencies make scraping possible //
var cheerio = require("cheerio");
var request = require("request");

// Initialize express //
var app = express();

// Configure the database //
var databaseUrl = "nytScraper";
var collections = ["scrapedData"];

// Link mongojs to the db variable //
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
})

// Set home route (Simple "Get Scraped Scrub" message to not have page blank) //
app.get("/", function(req, res) {
    res.send("Get Scraped Scrub");
});

// Set route to retrieve data from the db //
app.get("/all", function(req, res) {

    // Find all results from the scrapedData collection in the db //
    db.scrapedData.find({}, function(error, found) {

        // Log errors to the console //
        if (error) {
            console.log(error);
        }

        // If there are no errors, send data back to the browser as json //
        else {
            res.json(found);
        }
    });
});

// Set route to scrape data from the site and send it to the mongodb db //
app.get("/scrape", function(req, res) {

    // Make a request to the nyt //
    request("https://www.nytimes.com/", function(error, response, html) {

    // Load the html body from request into cheerio //
    var $ = cheerio.load(html);

    // For each element with a "title" class //
    $(".title").each(function(i, element) {

        // Save the text and href of each link enclosed in the current element //
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");

        // If this element has both a title and a link //
        if (title && link) {

            // Insert the scraped data into the scrapedData db //
            db.scrapedData.insert({
                title: title,
                link: link
            },
            function(err, inserted) {
                if (err) {

                    // Log the error if one is encountered during the query //
                    console.log(err);
                }
                else {
                    // If no error, log inserted data //
                    console.log(inserted);
                }
            });
        }
    });
});

    // Send a "Scrape Complete" message to the browser //
    res.send("Scrape Complete");
});

// Set app to listen/run on port 3000 //
app.listen(3000, function() {
    console.log("App running on port 3000!");
  });