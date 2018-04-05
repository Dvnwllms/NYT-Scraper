// Set depenencies //
var mongoose = require("mongoose");

// Save reference to Schema constructor //
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new HeadlineSchema object //
// Similar set up to Sequelise //
var HeadlineShcema = new Schema ({

    // Title is required as well as the type of string //
    title: {
        type: String,
        required: true,
    },

    // Link is required as well as type of string //
    link: {
        type: String,
        required: true,
    },

    // Summary a string and required // 
    // It will have the default value of "No summary available for this airticle" //
    summary: {
    type: String,
    default: "No summary is available for this article.",
    },

    // isSaved is a boolean and is required // 
    // It will have a default value of false //
    isSaved: {
    type: Boolean,
    default: false
    },

    // `note` is an object that stores a Note id //
    // The ref property links the ObjectId to the Note model //
    // This allows us to populate the Article with an associated Note //
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates our model from the above schema, using mongoose's built in model method //
var Headline = mongoose.model("Headline", HeadlineSchema);

// Export this file //
module.exports = Headline;