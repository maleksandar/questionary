'use strict';

module.exports = function (sequelize, DataTypes) {
  var Domain = sequelize.define("Domain",
    {
      text: {
        type: DataTypes.STRING(15),
        allowNull: false,
        primaryKey: true
      }
    },
    {
      timestamps: false,
    });

  return Domain;
};