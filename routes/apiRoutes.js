var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   //db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
  var NewsAPI = require("newsapi");
  var newsapi = new NewsAPI(process.env.API_KEY);
  app.post("/api/news", function(req, res) {
    console.log(req.body.topicSearched);
    var arrayObj = {
      articleTitleArray: [],
      articleUrlArray: []
    };
    newsapi.v2
      .everything({
        q: req.body.topicSearched,
        sources: req.body.source,
        sortBy: "relevancy",
        pageSize: 5
      })
      .then(function(response) {
        console.log(response);
        for (var i = 0; i < response.articles.length; i++) {
          arrayObj.articleUrlArray.push(response.articles[i].url);
          arrayObj.articleTitleArray.push(response.articles[i].title);
        }
        console.log(arrayObj);
        res.send(arrayObj);
      });
    //url parameters
    // var url =
    //   "https://newsapi.org/v2/everything?" +
    //   "q=" +
    //   req.body.topicSearched +
    //   "&sources=" +
    //   req.body.source +
    //   "&sortBy=relevancy&" +
    //   "pageSize=5&" +
    //   "apiKey=" +
    //   process.env.API_KEY;
    // var req = new Request(url);
    // fetch(req)
    //   .then(function(response) {
    //     console.log(response.status);
    //     return response.json();
    //   }) //turns the respon.json into usable data
    //   .then(function(data) {
    //     for (var i = 0; i < data.articles.length; i++) {
    //       articleObj.articleUrlArray.push(data.articles[i].url);
    //       articleObj.articleTitleArray.push(data.articles[i].title);
    //     }
    //     console.log(data);
    //     console.log(articleObj);
    //     res.send(articleObj);
    //   });
  });
};
