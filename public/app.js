// Grab the headlines as json //
$.getJSON("/headlines", function(data) {

    // Run a for loop for each headline scraped and display the info on the page //
    for (var i = 0; i < data.length; i++) {
        $("#headlines").append("<p data-id='" + data[i]._id + "'>" + data[i]._title + "<br />" + data[i].link + "</p>");
    }
});

// Whenever someone clicks a p tag //
$(document).on("click", "p", function() {

    // Empty notes from the notes section to avoid repeats //
    $("#notes").empty();

    // Save the id from the p tag //
    var thisId = $(this).attr("data-id");

    // Then make the ajax call for the headline //
    $.ajax({
        method: "GET",
        url: "/headlines/" + thisId
    })

    // After the call is made, add the note info to the page with a promise //
    .then(function(data) {
        console.log(data);

        // The title of the headline //
        $("#notes").append("<h2>" + data.title + "</h2>");

        // An input to enter a new title //
        $("#notes").append("<input id='titleinput' name='title' >");

        // A textarea to add a new note body //
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

        // A button to submit a new note, with the id of the headline saved to it //
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's a note in the headline //
      if (data.note) {

        // Place the title of the note in the title input //
        $("#titleinput").val(data.note.title);

        // Place the body of the note in the body textarea //
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button //
$(document).on("click", "#savenote", function() {

    // Grab the id associated with the headline from the submit button //
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs //
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {

        // Value taken from title input //
        title: $("#titleinput").val(),

        // Value taken from note textarea //
        body: $("#bodyinput").val()
      }
    })

      // With that done //
      .then(function(data) {

        // Log the response //
        console.log(data);

        // Empty the notes section to avoid repeats //
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry //
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
