$(document).ready(function() {
  // Get references to page elements
  var $exampleText = $("#example-text");
  var $exampleDescription = $("#example-description");
  var $submitBtn = $("#submit");
  var $exampleList = $("#example-list");

  // The API object contains methods for each kind of request we'll make
  var API = {
    saveExample: function(example) {
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: "api/examples",
        data: JSON.stringify(example)
      });
    },
    getExamples: function() {
      return $.ajax({
        url: "api/examples",
        type: "GET"
      });
    },
    deleteExample: function(id) {
      return $.ajax({
        url: "api/examples/" + id,
        type: "DELETE"
      });
    }
  };

  // refreshExamples gets new examples from the db and repopulates the list
  var refreshExamples = function() {
    API.getExamples().then(function(data) {
      var $examples = data.map(function(example) {
        var $a = $("<a>")
          .text(example.text)
          .attr("href", "/example/" + example.id);

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": example.id
          })
          .append($a);

        var $button = $("<button>")
          .addClass("btn btn-danger float-right delete")
          .text("ｘ");

        $li.append($button);

        return $li;
      });

      $exampleList.empty();
      $exampleList.append($examples);
    });
  };

  // handleFormSubmit is called whenever we submit a new example
  // Save the new example to the db and refresh the list
  var handleFormSubmit = function(event) {
    event.preventDefault();

    var example = {
      text: $exampleText.val().trim(),
      description: $exampleDescription.val().trim()
    };

    if (!(example.text && example.description)) {
      alert("You must enter an example text and description!");
      return;
    }

    API.saveExample(example).then(function() {
      refreshExamples();
    });

    $exampleText.val("");
    $exampleDescription.val("");
  };

  // handleDeleteBtnClick is called when an example's delete button is clicked
  // Remove the example from the db and refresh the list
  var handleDeleteBtnClick = function() {
    var idToDelete = $(this)
      .parent()
      .attr("data-id");

    API.deleteExample(idToDelete).then(function() {
      refreshExamples();
    });
  };

  // Add event listeners to the submit and delete buttons
  $submitBtn.on("click", handleFormSubmit);
  $exampleList.on("click", ".delete", handleDeleteBtnClick);
  ////////////
  //API CODE//
  ////////////

  var source = "";
  var topicSearched = "";
  //var userSelectedUrl;

  $("#submitSearch").on("click", function(event) {
    event.preventDefault();
    source = $("#sourceSelect")
      .val()
      .trim();
    topicSearched = $("#searchID")
      .val()
      .trim();
    console.log(source);
    console.log(topicSearched);
    $.ajax({
      method: "POST",
      url: "/api/news",
      data: {
        source: source,
        topicSearched: topicSearched
      }
    }).then(function(articleObj) {
      console.log(articleObj);
      var articleTitle = articleObj.articleTitleArray;
      var articleUrl = articleObj.articleUrlArray;
      var articleDisplay = $("<select />", {
        class: "form-control",
        id: "articleDisplay"
      });
      for (var i = 0; articleTitle.length; i++) {
        var option = $("<option />", {
          value: articleUrl[i]
        });
        option.text(articleTitle[i]);
        articleDisplay.append(option);
      }
      console.log(option);
      var option0 = $("<option />", {
        value: articleUrl[0]
      });
      var option1 = $("<option />", {
        value: articleUrl[1]
      });
      var option2 = $("<option />", {
        value: articleUrl[2]
      });
      var option3 = $("<option />", {
        value: articleUrl[3]
      });
      var option4 = $("<option />", {
        value: articleUrl[4]
      });
      option0.text(articleTitle[0]);
      articleDisplay.append(option0);
      option1.text(articleTitle[1]);
      articleDisplay.append(option1);
      option2.text(articleTitle[2]);
      articleDisplay.append(option2);
      option3.text(articleTitle[3]);
      articleDisplay.append(option3);
      option4.text(articleTitle[4]);
      articleDisplay.append(option4);
      $("#articles").html(articleDisplay);
    });
    //$('<input id="propagandize" class="btn btn-primary" type="submit" value="Propagandize">').after("#inputButton");
    // var submitButton = $("<input />", {
    //   class: "class=btn btn-primary",
    //   type: "type=submit",
    //   value: "value=Propagandize",
    //   id: "id=propagandize"
    // })
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
  });
});

////////////////////////////
//No longer using this API//
////////////////////////////
