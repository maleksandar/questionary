'use strict';

module.exports = function (sequelize, DataTypes) {
    var Tag = sequelize.define("Tag", {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: DataTypes.STRING(15),
            allowNull: false
        }
    },
    {
        timestamps: false,
        classMethods: {
            associate: function (models) {
                /* 
                 * Ready for usage in later development
                 * 
                Tag.belongsToMany(models.Question, { 
                    through: models.TagQuestion,
                    onDelete: "CASCADE",
                    foreignKey: "tagId"
                });
                //through is required
                */
            }
        }
     });

    return Tag;
};