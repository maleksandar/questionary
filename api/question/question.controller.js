'use strict';

var Question = require('../../models').Question;
var config = require ('../../config');
var exporter = {};

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

exporter.index = function(req, res) {
  return Question.findAll({
    attributes: [
      '_id',
      'headline',
      'text',
      'positiveVotes',
      'negativeVotes',
      'createdByUserId'
    ]
  })
    .then(questions => {
      res.status(200).json(questions);
    })
    .catch(handleError(res));
};

exporter.create = function(req, res) {
  var newQuestion = Question.build(req.body);
//   newQuestion.setDataValue('role', 'user');
  return newQuestion.save()
    .then(function(question) {
    //   var token = jwt.sign({ _id: user._id }, config.secrets.session, {
    //     expiresIn: 60 * 60 * 5
    //   });
    //   res.json({ token });
        res.json(question);
    })
    .catch(validationError(res));
};

module.exports = exporter;