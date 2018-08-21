module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define("Review", {
    answer1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    answer2: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    answer3: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    answer4: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    answer5: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    final_rating: {
      type: DataTypes.STRING,
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
    models.Review.belongsTo(models.Source, {
      //as: "Source",
      onDelete: "cascade",
      foreignKey: {
        allowNull: false
      }
    });
  };
  // Review.associate = function(models) {
  //   models.Review.belongsTo(models.Source, {
  //     onDelete: "CASCADE",
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   });
  //   models.Review.belongsTo(models.Article, {
  //     onDelete: "CASCADE",
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   });
  // };
  // Review.associate = function(models) {
  //   models.Review.belongsTo(models.Source, {
  //     onDelete: "CASCADE",
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   });
  // };
  return Review;
};
