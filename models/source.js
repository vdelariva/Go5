module.exports = function (sequelize, DataTypes) {
  var Source = sequelize.define("Source", {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },

    name: DataTypes.STRING
  });
  Source.associate = function (models) {
    Source.hasMany(models.Article, {
      onDelete: "CASCADE",
    });
  // Source.associate = function(models) {
  //   models.Source.hasMany(models.Review);
  // };

  };
  return Source;
};
