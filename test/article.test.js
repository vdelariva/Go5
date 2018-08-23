var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/articles", function () {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function () {
    request = chai.request(server);

    return db.sequelize.sync({ force: true });

  });

  it("should find all articles", function (done) {
    // Add some examples to the db to test with
    db.Source.bulkCreate([{ name: "Fox" }, { name: "CNN" }, { name: "Bloomberg" }, { name: "NY Times" }, { name: "BBC" }
    ]).then(function () {
      db.Article.bulkCreate([
        {
          title: "API Article",
          author: "Abhinav Sharma",
          publishDate: "2018-08-21 22:32:52.000Z",
          articleText: "This page documents data types appearing in jQuery function signatures, whether defined by JavaScript itself or further restricted by jQuery. Unless explicitly stated otherwise, jQuery functions require primitive values where applicable, and do not accept their Object-wrapped forms. If you want to study these concepts in depth, take a look at MDN. You should be ",
          SourceId: 2
        }]).then(function () {
          // Request the route that returns all examples
          request.get("/api/articles").end(function (err, res) {
            var responseStatus = res.status;
            var responseBody = res.body;

            // Run assertions on the response

            expect(err).to.be.null;

            expect(responseStatus).to.equal(200);

            expect(responseBody)
              .to.be.an("array")
              .that.has.lengthOf(1);

            expect(responseBody[0])
              .to.be.an("object")
              .that.includes({
                title: "API Article",
                author: "Abhinav Sharma",
                publishDate: "2018-08-21 22:32:52",
                articleText: "This page documents data types appearing in jQuery function signatures, whether defined by JavaScript itself or further restricted by jQuery. Unless explicitly stated otherwise, jQuery functions require primitive values where applicable, and do not accept their Object-wrapped forms. If you want to study these concepts in depth, take a look at MDN. You should be ",
                SourceId: 2
              });

            // The `done` function is used to end any asynchronous tests
            done();
          });
        });
    });

  });
});
