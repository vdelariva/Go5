// Global variables
var articleID = 0;
var sourceMap = new Map();

$(document).ready(function () {
  //API CODE
  //-----------------------------------------------------------------------------
  $(".alignRight").html(moment().format('dddd, MMMM Do, YYYY'));
  $(window).on("load", function (event) {
    event.preventDefault();

    var start = moment().startOf('day').format();
    var end = moment().endOf('day').format();

    // Get all sources
    $.ajax({
      method: "GET",
      url: `/api/sources`
    }).then(function(data){
      var sourcesArray = data;
      console.log("Source Data: "+sourcesArray);
      sourcesArray.forEach(obj=>sourceMap.set(obj.id, obj.name));
    });

    // Get today's articles from db
    $.ajax({
      method: "GET",
      url: `/api/articles/${start}/${end}`
    }).then(function (data) {
      console.log(`todays articles: ${JSON.stringify(data)}`);
      // If today's articles have not be posted, request from newsapi
      if (data.length === 0) {
        // Get today's headlines
        $.ajax({
          method: "POST",
          url: "/api/news"
        }).then(function (data) {
          //console.log(`*** apinews: ${JSON.stringify(data)}`);

          // Create array of objects for bulkCreate method
          var bulkData = data.map(function (article) {
            var articleObj = {
              title: article.title,
              author: article.author,
              publishDate: article.publishedAt,
              articleURL: article.url,
              SourceId: article.source.id
            };
            return articleObj;
          });

          var strBulkData = JSON.stringify(bulkData);
          console.log(`*** Stringify bulkData: ${strBulkData}`);
          // Post new articles to db
          $.ajax({
            method: "POST",
            url: "/api/articles",
            data: { articles: JSON.stringify(bulkData) }
          }).then(function (data) {
            console.log(`*** Article Inserted data: ${JSON.stringify(data)}`);
            // Get article text
            getArticleText(data);
            displayArticles(data, moment().format("MMM Do YYYY"));
          });
        });
      } else {
        // Display articles from db
        displayArticles(data, moment().format("MMM Do YYYY"));
      }
    });
  });
  //-----------------------------------------------------------------------------
  $(document).on("click", ".article", function (event) {
    event.preventDefault();
    articleID = $(this).attr("data-id");
    console.log(articleID);
    $.ajax({
      method: "GET",
      url: `/api/articles/${articleID}`
    }).then(function (data) {
      console.log(`modal: ${JSON.stringify(data)}`);
      var articleText = data[0].articleText;
      var articleSource = data[0].Source.name;
      var articleDate = data[0].publishDate;
      var articleTitle = data[0].title;

      $(".modal-title").html(`${articleTitle}`);
      if (articleText === null){
        // $(".modal-body").empty();
        $(".modal-body").html("<b style='color:red;'>Article still loading... Please check back later</b>");
        $(".modal-footer").hide();
      }
      else if (articleText === 'Show Clips') {
        $(".modal-body").html("<b style='color:red;'>Video Only, article not available</b>");
        $(".modal-footer").hide();
      }
      else {
        $(".modal-body").html(`<form id='surveyForm'>`
        + `<div id="articleText"></div>`
        + `<div>Answer the questions as appropriate, rank each part from 1 to 10 (1 = unreliable, 10 = excellent)<br><br></div>`
        + `<div class="form-row form-group mb-1">`
          + `<label for='currency' class='col-4 mb-0'><b>Currency:</b> Timeliness of the information.`
          + `<ul><li>When was it published?</li><li>Has it been revised or updated?</li></ul></label>`
          + `<div class='col-1'><input type='number' min='1' max='10' class='form-control percentage' id='currency' value=''></div>`
        + `<div class='col-1'></div>`
          + `<label for='relevance' class='col-5 mb-0'><b>Relevance:</b> Importance of the information.`
          + `<ul><li>Does it answer your question?</li><li>Would you be comfortable citing this source?</li></ul></label>`
          + `<div class='col-1'><input type='number' min='1' max='10' class='form-control percentage' id='relevance' value=''></div>`
        + `</div>`
        + `<div class='form-row form-group mb-1'>`
          + `<label for='authority' class='col-4 mb-0'><b>Authority:</b> Source of the information.`
          + `<ul><li>Who is the author?</li><li>What are the author's credentials?</li></ul></label>`
          + `<div class='col-1'><input type='number' min='1' max='10' class='form-control percentage' id='authority' value=''></div>`
        + `<div class='col-1'></div>`
          + `<label for='accuracy' class='col-5 mb-0'><b>Accuracy:</b> Reliability & truthfulness of the information.`
          + `<ul><li>Is it supported by evidence?</li><li>Can you verify information in another source?</li><li>Any errors?</li></ul></label>`
          + `<div class='col-1'><input type='number' min='1' max='10' class='form-control percentage' id='accuracy' value=''></div>`
        + `</div>`
        + `<div class='form-row form-group mb-1'>`
          + `<label for='purpose' class='col-4 mb-0'><b>Purpose:</b> Reason the information exists.`
          + `<ul><li>Do the authors make their intentions clear?</li><li>Is the point of view objective & impartial?</li><li>Is it biased?</li></ul></label>`
          + `<div class='col-1'><input type='number' min='1' max='10' class='form-control percentage' id='purpose' value=''></div>`
        + `</div>`
        + `<div class='form-group row mb-1'>`
          + `<label for='comments' class='col-12 col-form-label'><b>Comments:</b><p></p>`
          + `<textarea class="form-control" id="comments" rows="5" placeholder="Share your thoughts on the legitimacy of the source here..."></textarea></div>`
        + `</div>`
        + `</form>`
        + `<div class="alert alert-danger collapse mt-2"role="alert">
            <a href="#" class="close">&times;</a>
            <strong>Fake Ratings are just as bad as Fake News!</strong> You must enter a rating between 1 and 10!
          </div>`);
        $(".modal-footer").show();
        $("#articleText").html(`<b>Source: </b>${articleSource} <span style="float:right"><b>Published Date: </b>${moment(articleDate).format("MMM Do YYYY")}</span><br><br>`
        + `<b>Article: </b>${articleText}`
        + `<br><hr>`);
      }
    });
  });
  //-----------------------------------------------------------------------------
  $("#submitDate").on("click", function (event) {
    event.preventDefault();

    // Search for articles from db
    var searchDate = $("#searchDate").val();
    console.log(`searchDate: ${searchDate}`);

    var start = moment.utc(searchDate).startOf('day').format();
    var end = moment.utc(searchDate).endOf('day').format();

    $.ajax({
      method: "GET",
      url: `/api/articles/${start}/${end}`
    }).then(function (data) {
      console.log(`another day articles: ${JSON.stringify(data)}`);
      // If today's articles have not be posted, request from newsapi
      if (data.length !== 0) {
        displayArticles(data, moment(searchDate).format("MMM Do YYYY"));
        $("#collapseTwo2").removeClass("show");
        $("#collapseOne1").toggleClass("collapse show");
      }
    });
  });
  //-----------------------------------------------------------------------------
  $("#submitTest").on("click", function (event) {
    event.preventDefault();
    
    var validForm = validateForm();

    if (validForm === true){
      
      console.log($("#currency").val());
      var currency = parseInt($("#currency").val());
      var relevance = parseInt($("#relevance").val());
      var authority = parseInt($("#authority").val());
      var accuracy = parseInt($("#accuracy").val());
      var purpose = parseInt($("#purpose").val());
      var comments = $("#comments").val().trim();

      var review = {
        currency: currency,
        relevance: relevance,
        authority: authority,
        accuracy: accuracy,
        purpose: purpose,
        ArticleId: articleID,
        comments: comments,
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
    } else {
      $('.alert').show();
      return false;
    }
    location.reload(); 
  });
  //-----------------------------------------------------------------------------
  // Close alert - Unable to find in modal, needs to search the entire document 
  $(document).on("click", ".close", function(event){
    event.preventDefault();
    $('.alert').hide();
  });
});

//-----------------------------------------------------------------------------
// Functions
//-----------------------------------------------------------------------------
function validateForm() {
  var isValid = true;
  $('.percentage').each(function () {
    if ($(this).val() === "" || ($(this).val() > 10) || ($(this).val() < 1)) {
      isValid = false;
    } 
  });
  return isValid;
}
//-----------------------------------------------------------------------------
function calculateFinalRating(currency, relevance, authority, accuracy, purpose) {
  var rating = (currency + relevance + authority + accuracy + purpose) / 5;
  return rating;
}
//-----------------------------------------------------------------------------
function displayArticles(data, displayDate) {
  console.log(`displayArticles data: ${JSON.stringify(data)})`);
  console.log(sourceMap);
  var $articles = data.map(function (article) {
    console.log(article);

    var $li = $("<li>").html(`<b>${sourceMap.get(article.SourceId)}:</b> ${article.title}<span class="ratings" data-articleid=${article.id} style="float:right"></span>`)
      .attr({
        "data-toggle": "modal",
        "data-target": "#myModal",
        "data-id": article.id,
        "class": "article mb-3",
        "data-url": article.articleURL
      });
    return $li;
  });
  $("#headlines").html(`<i class="fa fa-angle-down rotate-icon"></i> Headlines for: ${displayDate}`);
  $("#currentArticles").empty();
  $("#currentArticles").append($articles);

  displayReviews(data);
}
//-----------------------------------------------------------------------------
// Get article text using diffbot api
function getArticleText(data) {
  data.forEach(function (article) {
    var queryURL =
      "https://api.diffbot.com/v3/article?token=" + "0150e312d481dd56d0cbd136243d2bc4" + "&url=" +
      article.articleURL;
    console.log(`URL: ${queryURL}`);
    $.when($.ajax({
      url: queryURL,
      method: "GET"
    })).then(function (response) {
      console.log(`diffbot response: ${response.objects[0].text}`);
      console.log(`******* data: ${JSON.stringify(data)}`);
      console.log(`dataId: ${article.id}`);
      addArticleText(response.objects[0].text, article.id);
    });
  });
}
//-----------------------------------------------------------------------------
function addArticleText(articleText, id) {
  // Update article entry in db with article text
  // console.log(`addArticle id: ${id}`);
  console.log(`addArticle articleText: ${articleText}`);
  $.ajax({
    method: "PUT",
    url: `/api/article/${id}`,
    data: { articleText: articleText }
  }).then(function (data) {
    console.log(`ArticleText save: ${JSON.stringify(data)}`);
  });
}
//-----------------------------------------------------------------------------
// Get all reviews for a specific article
function getAllArticleReviews(articleId, callback){
  var rating = 0;

  $.when($.ajax({
    method: "GET",
    url: `/api/reviews/article/${articleId}`
  })).then(function (data){
  //console.log(`Reviews: ${data}`);
    if (data.length !== 0) {
      // display rating
      for (var i = 0; i < data.length; i++) {
        rating += parseInt(data[i].finalRating);
      }
      rating = rating / data.length;
      //console.log(`cumRating: ${rating}`);
      callback(rating);
    }
    callback(rating);
  });
}
//-----------------------------------------------------------------------------
//Display ratings for all articles
function displayReviews(data){
  var currentArticle;
  data.forEach(function (article){
    getAllArticleReviews(article.id, function (ratingVal){
      if (ratingVal !== 0){
        currentArticle = $(`[data-articleid=${article.id}]`);
        console.log("Current Article: "+currentArticle.text);
        console.log("Rating for article: "+article.id+" = "+ratingVal);
        currentArticle.html('<b>Rating: </b>'+ratingVal);
      }
    });
  });
}
