module.exports = function(sequelize, DataTypes) {
  var Article = sequelize.define("Article", {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    articleURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    articleText:{
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [1]
      }
    }
  });
  Article.associate = function(models) {
    Article.belongsTo(models.Source, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  // Article.associate = function(models) {
  //   models.Article.hasMany(models.Review);
  // };
  return Article;
};
