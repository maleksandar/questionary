'use strict'

module.exports = function (sequelize, DataTypes) {
    var QuestionVote = sequelize.define('QuestionVote', {

    },
    {
        timestamps: false
    });
    return QuestionVote;
}
