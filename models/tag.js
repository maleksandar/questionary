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
                Tag.belongsToMany(models.Question, { 
                    through: "TagQuestion",
                    onDelete: "CASCADE",
                    foreignKey: "tagId"
                });
            }
        }
     });

    return Tag;
};
