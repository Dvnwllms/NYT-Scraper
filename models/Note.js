// Set dependencies //
var mongoose = require("mongoose");

// Save a reference to the Schema constructor //
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object //
// Similar set up to Sequelise //
var NoteSchema = new Schema ({
    
    // Title is a string //
    title: String,

    // Body is a string //
    body: String,
});

// This creates our model from the above schema, using mongoose's built in model method //
var Note = mongoose.model("Note", NoteSchema);

// Export this file //
module.exports = Note;