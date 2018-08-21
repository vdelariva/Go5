module.exports = function(sequelize, DataTypes) {
  var Source = sequelize.define("Source", {
    name: DataTypes.STRING
  });
  // Source.associate = function(models) {
  //   models.Source.hasMany(models.Review);
  // };
  Source.associate = function(models) {
    models.Source.hasMany(models.Article);
  };
  return Source;
};
