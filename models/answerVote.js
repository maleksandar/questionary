'use strict'

module.exports = function (sequelize, DataTypes) {
    var AnswerVote = sequelize.define('AnswerVote', {

    },
    {
        timestamps: false
    });
    return AnswerVote;
}

