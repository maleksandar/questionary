'use strict';
var classMethods = {
    associate: function(models) {
        Question.belongsTo(models.User);
    }
};
module.exports = function(sequelize, DataTypes) {
    var Question = sequelize.define('Question', {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        headline: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        text: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: true
            }
        },
        positiveVotes: {
            type: DataTypes.INTEGER,
        },
        negativeVotes: {
            type: DataTypes.INTEGER,
        }    
    },
    {
        classMethods: {
            associate: function(models) {
                Question.belongsTo(models.User, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    },
                    as: "createdByUser"
                });
            }
        }
    });

    return Question;
};