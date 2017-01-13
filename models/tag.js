'use strict';

module.exports = function (sequelize, DataTypes) {
  var Tag = sequelize.define("Tag",
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

  return Tag;
};


