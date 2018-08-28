# Cred-Checker Daily

## Group Project ##

**Description**

Fake news here! Fake news there! Fake news everywhere! Our world is constantly feeding us news that just doesn't make the honesty cut. So here at the Cred-Checker Daily, we decided to hold the fake news participants accountable by creating a product that allows users to assign a score to the articles they read and displaying the cumulative results to the world.

**Results** 

* Pull news data from two API's working synergistically together
* Store data from API calls into database
* Display article information, including text, from database
* Listing of Today's Top Headlines
* Show credibility ratings for all reviewed articles
* User submits a 1-10 rating for each article along with comments
* Search for articles by date
* Display modal upon click of an article

**Challenges** 

* As a result of the asychronous response of the multiple apis, the application did not always have the necessary information available when needed.
* Circular Relationships between Article-Source-Review models causing sequelize to throw errors. We resolved by relating them linearly
* Higher response times of Diffbot api made app to load slower for first user

**Improvements** 

1. Show Credibility Ratings for each source
1. Clean up code, incorporate more handlebars to simplify dynamic html
1. User logins to eventually give credibility ratings to other users
1. Allow users to view the comments made by other users

## Tools ##

**APIs**
* Newsapi: Live top & breaking news headlines
* Diffbot

**Frameworks**
* Bootstrap
* Handlebars

**Libraries**
* Moment.js
* body-parser
* dotenv
* express
* express-handlebars
* mysql2
* newsapi
* sequelize

**Database**
* MySQL
