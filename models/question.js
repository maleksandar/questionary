'use strict';

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
            defaultValue: 0
        },
        negativeVotes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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

                Question.belongsToMany(models.Tag, {
                   through: "TagQuestion",
                   onDelete: "CASCADE",
                   foreignKey: "questionId",
                   timestamps: false
                });
            }
        }
    });

    return Question;
};