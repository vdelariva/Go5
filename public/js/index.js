$(document).ready(function () {
  var articleID = 0;
  var sourceMap = new Map();
  //API CODE
  //-----------------------------------------------------------------------------
  $(".alignRight").html(moment().format('dddd, MMMM Do, YYYY'));
  $(window).on("load", function (event) {
    event.preventDefault();

    // Get today's articles from db
    var start = moment.utc().startOf('day').format();
    var end = moment.utc().endOf('day').format();

    $.ajax({
      method: "GET",
      url: `/api/sources`
    }).then(function(data){
      var sourcesArray = data;
      console.log("Source Data: "+sourcesArray);
      sourcesArray.forEach(obj=>sourceMap.set(obj.id, obj.name));
      

      console.log(sourceMap.get("fox-news"));
    });

    $.ajax({
      method: "GET",
      url: `/api/articles/${start}/${end}`
    }).then(function (data) {
      //console.log(`todays articles: ${JSON.stringify(data)}`);
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
            data: { temp: JSON.stringify(bulkData) }
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
      console.log(data);
      console.log(data.articleText);
      var articleText = data[0].articleText;
      var articleTitle = data[0].title;
      console.log(articleText);
      $("#articleText").html(`<b>Title: </b>${articleTitle}<br><br>`
        + `<b>Article: </b>${articleText}`
        + `<br><hr>`);
      return;
    });
    // Pop up modal to show article & survey
    $(".modal-title").html("<b>CRAAP Survey</b><br>Evaluating Web Resources");
    $(".modal-body").html(`<form id='surveyForm'>`
      + `<div id="articleText"></div>`
      + `<div>Answer the questions as appropriate, rank each part from 1 to 10 (1 = unreliable, 10 = excellent)</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='currency' class='col-10 col-form-label'><b>Currency:</b> Timeliness of the information.`
      + `<ul><li>When was it published?</li><li>Has it been revised or updated?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control percentage' id='currency' value=''></div>`
      + `</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='relevance' class='col-10 col-form-label'><b>Relevance:</b> Importance of the information.`
      + `<ul><li>Does it answer your question?</li><li>Would you be comfortable citing this source?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control percentage' id='relevance' value=''></div>`
      + `</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='authority' class='col-10 col-form-label'><b>Authority:</b> Source of the information.`
      + `<ul><li>Who is the author?</li><li>What are the author's credentials?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control percentage' id='authority' value=''></div>`
      + `</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='accuracy' class='col-10 col-form-label'><b>Accuracy:</b> Reliability & truthfulness of the information.`
      + `<ul><li>Is it supported by evidence?</li><li>Can you verify information in another source?</li><li>Any errors?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control percentage' id='accuracy' value=''></div>`
      + `</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='purpose' class='col-10 col-form-label'><b>Purpose:</b> Reason the information exists.`
      + `<ul><li>Do the authors make their intentions clear?</li><li>Is the point of view objective & impartial?</li><li>Is it biased?</li></ul></label>`
      + `<div class='col-2'><input type='number' min='1' max='10' class='form-control percentage' id='purpose' value=''></div>`
      + `</div>`
      + `<div class='form-group row mb=0'>`
      + `<label for='comments' class='col-12 col-form-label'><b>Comments:</b><p></p>`
      + `<textarea class="form-control" id="comments" rows="5" placeholder="Share your thoughts on the legitimacy of the source here..."></textarea></div>`
      + `</div>`
      + `</form>`);
    // $("#saveChanges").attr("data-key",$(this).data("id"));
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
      if (data.length === 0) {
        // no articles for the search date
        console.log(`No articles for: ${moment(searchDate).format("MMM Do YYYY")}`);
      }
      else {
        displayArticles(data, moment(searchDate).format("MMM Do YYYY"));
      }
    });
  });
  //-----------------------------------------------------------------------------
  $("#submitTest").on("click", function (event) {
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
    var comments = $("#comments").val().trim();

    var review = {
      currency: currency,
      relevance: relevance,
      authority: authority,
      accuracy: accuracy,
      purpose: purpose,
      ArticleId: articleID, //Needs to capture value
      comments: comments, //Needs to capture value
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

  //-----------------------------------------------------------------------------
  function articleRating(finalRating) {
    if (finalRating >= 8) {
      $("#rating").html("<img src='../images/credibleSmall.jpg'>");
      return;
    } else if (finalRating < 8 && finalRating >= 6) {
      $("#rating").html("<img src='../images/approvedSmall.jpg'>");
      return;
    } else if (finalRating < 6 && finalRating >= 4) {
      $("#rating").html("<img src='../images/misleadingSmall.jpg'>");
      return;
    } else {
      $("#rating").html("<img src='../images/fakenewsSmall.jpg'>");
      return;
    }
  }

  //-----------------------------------------------------------------------------
  function displayArticles(data, displayDate) {
    console.log(`displayArticles data: ${JSON.stringify(data)})`);
    console.log(sourceMap);
    var $articles = data.map(function (article) {
      // var $li = $("<li>").html(`${article.title}`)
      var $li = $("<li>").html(`<b>${sourceMap.get(article.SourceId)}:</b> ${article.title}`)
        .attr({
          "data-toggle": "modal",
          "data-target": "#myModal",
          "data-id": article.id,
          "class": "article",
          "data-url": article.articleURL
        });
      return $li;
    });
    $("#headlines").html(`Headlines for: ${displayDate}<i class="fa fa-angle-down rotate-icon"></i>`);
    $("#currentArticles").empty();
    $("#currentArticles").append($articles);
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
});