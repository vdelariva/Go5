var db = require("../models");

module.exports = function(app) {
  // Get all reviews
  app.get("/api/reviews", function(req, res) {
    db.Review.findAll({}).then(function(dbReview) {
      res.json(dbReview);
    });
  });

  // Get all news sources
  app.get("/api/sources", function(req, res) {
    db.Source.findAll({}).then(function(dbSource) {
      res.json(dbSource);
    });
  });

  // Get all articles
  app.get("/api/articles", function(req, res) {
    db.Article.findAll({}).then(function(dbArticle) {
      res.json(dbArticle);
    });
  });

  //Get all articles for a source
  app.get("/api/articles/source/:sourceId", function(req, res) {
    db.Article.findAll({
      where: {
        SourceId: req.params.sourceId
      }
    }).then(function(dbArticle) {
      res.json(dbArticle);
    });
  });

  // Get all reviews for an article
  app.get("/api/reviews/:articleId", function(req, res) {
    db.Review.findAll({
      where: {
        ArticleId: req.params.articleId
      },
      include: [
        {
          model: db.Source,
          as: "Source"
        },
        {
          model: db.Article,
          as: "Article"
        }
      ]
    }).then(function(dbReview) {
      res.json(dbReview);
    });
  });

  //Get all reviews for a source
  app.get("/api/reviews/:sourceId", function(req, res) {
    db.Review.findAll({
      where: {
        SurceId: req.params.sourceId
      },
      include: [
        {
          model: db.Source,
          as: "Source"
        },
        {
          model: db.Article,
          as: "Article"
        }
      ]
    }).then(function(dbReview) {
      res.json(dbReview);
    });
  });

  // Create a new Review
  app.post("/api/review", function(req, res) {
    db.Review.create(req.body).then(function(dbReview) {
      res.json(dbReview);
    });
  });

  //Insert a new Article
  app.post("/api/article", function(req, res) {
    db.Article.create(req.body).then(function(dbArticle) {
      res.json(dbArticle);
    });
  });

  //Update an Article
  
  app.put("/api/article/:id", function(req, res) {
  console.log(req.body.articleText);
  console.log(req.params.id);
    db.Article.update({
      articleText: req.body.articleText
    }, {
      where:{
        id:req.params.id
      }
    }, function(dbArticle) {
      if (dbArticle.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.json(dbArticle);
      }
    });
  });

  //Route to get articles for a source from external API call
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
