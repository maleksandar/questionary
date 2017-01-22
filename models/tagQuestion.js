'use strict';

module.exports = function (sequelize, DataTypes) {
  var TagQuestion = sequelize.define("TagQuestion",
    {
      QuestionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      TagText: {
        type: DataTypes.STRING(15),
        allowNull: false,
        primaryKey: true
      }
    },
    {
      timestamps: false,
      classMethods: {
        associate: function (models) {
          TagQuestion.belongsTo(models.Question, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });

          TagQuestion.belongsTo(models.Tag, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    });

  return TagQuestion;
};


