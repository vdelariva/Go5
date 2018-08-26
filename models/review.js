module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define("Review", {
    currency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    relevance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    authority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    accuracy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    purpose: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true
    },
    finalRating: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Review.associate = function(models) {
    models.Review.belongsTo(models.Article, {
      //as: "Article",
      onDelete: "cascade",
      foreignKey: {
        allowNull: false
      }
    });
    // models.Review.belongsTo(models.Source, {
    //   //as: "Source",
    //   onDelete: "cascade",
    //   foreignKey: {
    //     allowNull: false
    //   }
    // });
  };
  return Review;
};
