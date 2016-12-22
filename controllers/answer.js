'use strict';

var Answer = require('../models').Answer;
var config = require ('../config');
var Router = require('express').Router;
var auth = require('../auth/auth.service');

var router = new Router();

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

router.get('/question/:id', function(req, res) {
  return Answer.findAll({
    attributes: [
      '_id',
      'text',
      'positiveVotes',
      'negativeVotes',
      'forQuestionId',
      "createdByUserId"
    ],
    where: {
      forQuestionId: req.params.id
    }
  })
    .then(answers => {
      res.status(200).json(answers);
    })
    .catch(handleError(res));
});

router.post('/', auth.isAuthenticated(), function(req, res) {
  var newAnswer = Answer.build(req.body);
  newAnswer.createdByUserId = req.user._id;
  return newAnswer.save()
    .then(function(answer) {
        res.json(answer);
    })
    .catch(validationError(res));
});

module.exports = router;