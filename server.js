// Set dependencies //
var express = require("express");
var bodyParser = require("body-parser");
var exhbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");

// These two dependencies make scraping possible //
var cheerio = require("cheerio");
var request = require("request");

// Require all models //
var db = require("./models");
var Note = require("./models/Note.js");
var Headline = require("./models/Headline.js");

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
app.engine("handlebars", exhbs({defaultLayout: "views"}));
app.set("view engine", "handlebars");

// Set up for Heroku deployment? Still confused on this //
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Set home route (Simple message to not have page blank) //
app.get("/", function(req, res) {
    res.send("Don't be mad at me if you get caught scraping bruh");
});

// Set route for scraping the website //
app.get("/scrape", function(req, res) {
    request("https://www.nytimes.com/", function(err, res, html) {
        // console.log(res); //

        // Use cheerio to pull the h2 tagged elements in the site //
        var $ = cheerio.load(html);

        // Use a function to only show the first 20 results, otherwise there will be way too many //
        $("h2").each(function(i) {
            if (i >= 21) {
                return;
            }
           console.log(i);

    // Save an empty result object //
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object //
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using the Headline model, create a new entry //
      // This passes the result object to the entry (and the title and link) //
      var entry = new Headline(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {

        // Log any errors //
        if (err) {
          console.log(err);
        }

        // Or else log the doc //
        else {
          console.log(doc);
        }
        });
      });
    });

    // Message to tellthe browser that the scraping is complete //
    res.send("Scrape Complete");
    console.log(res)
});

// This will get the articles we scraped from the mongoDB //
app.get("/headlines", function(req, res) {

    // Grab every doc in the Headlines array //
    Headline.find({}, function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      
      // Or send the doc to the browser as a json object //
      else {
        res.json(doc);
      } 
    });
    console.log(res)
  });
  
  // Grab an article by it's ObjectId //
  app.get("/headlines/:id", function(req, res) {

    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db //
    Headline.findOne({ "_id": req.params.id })

    // Populate all of the notes associated with it //
    .populate("note")

    // Now, execute our query //
    .exec(function(error, doc) {

      // Log any errors //
      if (error) {
        console.log(error);
      }

      // Otherwise, send the doc to the browser as a json object //
      else {
        res.json(doc);
      }
    });
  });
  
  // Create a new note or replace an existing note //
  app.post("/headlines/:id", function(req, res) {

    // Create a new note and pass the req.body to the entry //
    var newNote = new Note(req.body);
  
    // And save the new note the db //
    newNote.save(function(error, doc) {

      // Log any errors //
      if (error) {
        console.log(error);
      }

      // Otherwise //
      else {

        // Use the headline id to find and update it's note //
        Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })

        // Execute the above query //
        .exec(function(err, doc) {

          // Log any errors //
          if (err) {
            console.log(err);
          }
          else {

            // Or send the document to the browser //
            res.send(doc);
          }
        });
      }
    });
  });

// Set app to listen/run on port 3000 //
app.listen(3000, function() {
    console.log("App running on port 3000!");
  });