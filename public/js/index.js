$(document).ready(function () {
  ////////////
  //API CODE//
  ////////////
  $(".alignRight").html(moment().format('dddd, MMMM Do, YYYY'));
  $(window).on("load", function(event) {
    event.preventDefault();

    // Get today's articles from db
    var start = moment.utc().startOf('day'); 
    var end = moment.utc().endOf('day'); 

    console.log(`start: ${start} end: ${end}`);
    
    $.ajax({
      method: "GET",
      url: `/api/articles/${start}/${end}`
    }).then(function(data) {
      console.log(`todays articles: ${JSON.stringify(data)}`);
      if (data.length === 0){
        // Get today's headlines
        $.ajax({
          method: "POST",
          url: "/api/news"
        }).then(function(data) {
          console.log(`apinews: ${JSON.stringify(data)}`);
          // Save articles to db OPTION 1 bulkCreate

          // Create array of objects
          var bulkData = data.map(function(article){
            var articleObj = {
              title: article.title,
              author: article.author,
              publishDate: article.publishedAt
            };
            return articleObj;
          });

          var strBulkData = JSON.stringify(bulkData);
          console.log(`Option 1 stringify bulkData: ${strBulkData}`);

          $.ajax({
            method: "POST",
            url: "/api/articles",
            data: {temp:JSON.stringify(bulkData)}
          }).then(function(data){
            console.log(`Option 1 then data: ${JSON.stringify(data)}`);
            displayArticles(data);
          });
        });
      } else {
        displayArticles(data);
      }
    });
  });

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

  $("#submitTest").on("click", function(event){
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
      ArticleId: 1009, //Needs to capture value
      SourceId: 2, //Needs to capture value
      comments: "This is fake news!!", //Needs to capture value
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

    // values captured. Now I need to take these values and assign them to the article
    articleRating(review.finalRating);
  });

  function articleRating(finalRating) {
    if (finalRating >= 8){
      $("#rating").html("<img src='../images/credibleSmall.jpg'>");
      return;
    } else if (finalRating < 8 && finalRating >=6){
      $("#rating").html("<img src='../images/approvedSmall.jpg'>");
      return;
    } else if (finalRating < 6 && finalRating >=4){
      $("#rating").html("<img src='../images/misleadingSmall.jpg'>");
      return;
    } else {
      $("#rating").html("<img src='../images/fakenewsSmall.jpg'>");
      return;
    }
  }

  function displayArticles (data) {
    console.log(`displayArticles data: ${JSON.stringify(data)})`);
    var $articles = data.map(function(article) {
      var $li = $("<li>").html("<b>" + article.source.name +"</b>" + ": " + article.title)
        .attr({
          class: "btn btn-primary",
          type: "submit",
          "data-toggle": "modal", 
          "data-target":'#myModal'
        });
      return $li;
    });
    var urls = [];
    for (var i = 0; i < data.length; i++) {
      urls.push(data[i].url);
    }
    console.log(urls);
    urls.forEach(function(url) {
      var queryURL =
      "https://api.diffbot.com/v3/article?token=" + "0150e312d481dd56d0cbd136243d2bc4" + "&url=" +
      url;
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response.objects[0].text);//Would just need to append onto a div in the modal
      });
    });
    $("#currentArticles").empty();
    $("#currentArticles").append($articles);
  }

  // $("#propagandize").on("click", function(event) {
  //   event.preventDefault();
  //   userSelectedUrl = $("#articleDisplay")
  //     .val()
  //     .trim();
  //   console.log(userSelectedUrl);
  //   var queryURL =
  //     "https://api.diffbot.com/v3/article?token=0150e312d481dd56d0cbd136243d2bc4&url=" +
  //     userSelectedUrl;
  //   $.ajax({
  //     url: queryURL,
  //     method: "GET"
  //   }).then(function(response) {
  //     console.log(response);
  //     var textFromUrl = response.objects[0].text;
  //     console.log(textFromUrl);
  //     $("#textDisplay").text(textFromUrl);
  //   });
  // });
  // }); Braces are for a SubmitTest function that's no longer running

});

////////////////////////////
//No longer using this API//
////////////////////////////
