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

    articleText:{
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    articleURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    relevance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    authority: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    accuracy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    purpose: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true
    },
    finalRating: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }

  });
  Article.associate = function(models) {
    models.Article.belongsTo(models.Source, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  Article.associate = function(models) {
    models.Article.hasMany(models.Review);
  };
  return Article;
};
