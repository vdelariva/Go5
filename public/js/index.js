$(document).ready(function () {
  ////////////
  //API CODE//
  ////////////

  $(window).on("load", function (event) {
    event.preventDefault();

    $.ajax({
      method: "POST",
      url: "/api/news",
      // data: {
      //   category: category,
      //   searchDate: searchDate
      // }
    }).then(function (data) {
      console.log(`submitSearch: ${JSON.stringify(data)}`);
      var $articles = data.map(function (article) {
        var $li = $("<li>").text(article.title);
        return $li;
      });

      $("#currentArticles").empty();
      $("#currentArticles").append($articles);
    });
  });

  // Display Modal
  $("#testModal").on("click", function (event) {
    event.preventDefault();
    console.log('modal');
    // Pop up modal to show article & survey
    $(".modal-title").html("<b>CRAAP Survey</b><br>Evaluating Web Resources");
    $(".modal-body").html(`<form id='surveyForm'>`
      + `<div>Answer the questions as appropriate, rank each part from 1 to 10 (1 = unreliable, 10 = excellent)</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='currency' class='col-10 col-form-label'><b>Currency:</b> Timeliness of the information.`
      + `<ul><li>When was it published?</li><li>Has it been revised or updated?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control' id='currency' value=''></div>`
      + `</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='relevance' class='col-10 col-form-label'><b>Relevance:</b> Importance of the information.`
      + `<ul><li>Does it answer your question?</li><li>Would you be comfortable citing this source?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control' id='relevance' value=''></div>`
      + `</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='authority' class='col-10 col-form-label'><b>Authority:</b> Source of the information.`
      + `<ul><li>Who is the author?</li><li>What are the author's credentials?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control' id='authority' value=''></div>`
      + `</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='accuracy' class='col-10 col-form-label'><b>Accuracy:</b> Reliability & truthfulness of the information.`
      + `<ul><li>Is it supported by evidence?</li><li>Can you verify information in another source?</li><li>Any errors?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control' id='accuracy' value=''></div>`
      + `</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='purpose' class='col-10 col-form-label'><b>Purpose:</b> Reason the information exists.`
      + `<ul><li>Do the authors make their intentions clear?</li><li>Is the point of view objective & impartial?</li><li>Is it biased?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control' id='purpose' value=''></div>`
      + `</div></form>`);

    // $("#saveChanges").attr("data-key",$(this).data("id"));
  });

  $("#submitTest").click(function (event) {
    event.preventDefault();
    function calculateFinalRating(currency, relevance, authority, accuracy, purpose) {
      var rating = (currency + relevance + authority + accuracy + purpose) / 5;
      return rating;
    }
    console.log($("#currency").val());
    var currency = parseInt($("#currency").val());
    var relevance = parseInt($("#relevance").val());
    var authority = parseInt($("#authority").val());
    var accuracy = parseInt($("#accuracy").val());
    var purpose = parseInt($("#purpose").val());

    var review = {
      currency: currency,
      relevance: relevance,
      authority: authority,
      accuracy: accuracy,
      purpose: purpose,
      ArticleId: 1009,
      SourceId: 2,
      comments: "This is fake news!!",
      finalRating: calculateFinalRating(currency, relevance, authority, accuracy, purpose)
    };
    console.log(JSON.stringify(review));
    $.ajax({
      method: "POST",
      url: "/api/review",
      data: review
    }).then(function (data) {
      console.log(`ReviewSaved: ${JSON.stringify(data)}`);

    });
  });

});

////////////////////////////
//No longer using this API//
////////////////////////////
