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
    newsapi.v2
      // .everything({
      .topHeadlines({
        // q: req.body.topicSearched,
        // category: req.body.category,
        sources: "fox-news,cnn,the-washington-post,bbc-news,bloomberg,the-huffington-post,the-washington-times,reuters,the-hill,the-new-york-times,associated-press",
        // sortBy: "publishedAt",
        // from: "2018-08-20",
        language: "en",
        // country: "us",
        pageSize: 5
      })
      .then(function(response) {
        var articles = response.articles;
        console.log(`api/articles: ${JSON.stringify(articles)}`);
        res.json(articles);
      });
  });
};
