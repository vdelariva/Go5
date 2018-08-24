var db = require("../models");

const Op = db.Sequelize.Op;

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

  //Get all articles for a specific date
  app.get("/api/articles/:start/:end", function(req, res) {
    db.Article.findAll({
      where: {
        publishDate: {[Op.between]:[req.params.start,req.params.end]}
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
    console.log(`article post: ${JSON.stringify(req.body)}`);
    db.Article.create(req.body).then(function(dbArticle) {
      res.json(dbArticle);
    });
  });

  //Update an Article, add article text
  app.put("/api/article/:id", function(req, res) {
    // console.log(`api articleText: ${req.body}`);
    console.log(`**** req.body ****`);
    console.log(req.body);
    console.log(`api id: ${req.params.id}`);
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

  //Insert new Articles
  app.post("/api/articles", function(req, res) {
  // console.log(`articles body: ${req.body}`);
    // console.log("test body");
    // console.log(req.body);
    var newBody = req.body.temp;
    // console.log("newbody");
    // console.log(newBody);

    db.Article.bulkCreate(JSON.parse(newBody)).then(function(dbArticle) {
      res.json(dbArticle);
    });
  });

  //Route to get articles for a source from external API call
  var NewsAPI = require("newsapi");
  var newsapi = new NewsAPI(process.env.API_KEY);

  app.post("/api/news", function(req, res) {
    newsapi.v2
      .topHeadlines({
        sources: "fox-news,cnn,the-washington-post,bbc-news,bloomberg,the-huffington-post,the-washington-times,reuters,the-hill,the-new-york-times,associated-press",
        language: "en",
        // country: "us",
        pageSize: 2
      })
      .then(function(response) {
        var articles = response.articles;
        res.json(articles);
      });
  });
};
