'use strict';

//Many-to-Many association 
module.exports = function(sequelize, DataTypes) {
    var TagQuestion = sequelize.define("TagQuestion", {
        
    },
    {
        timestamps: false
    });

    return TagQuestion;
};