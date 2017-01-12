'use strict';

var Question = require('../models').Question;
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

/**
 * Get list of questions
 */
router.get('/', function(req, res) {
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
});

/**
 * Create a new question
 */
router.post('/', auth.isAuthenticated(), function(req, res) {
  var newQuestion = Question.build(req.body);
  newQuestion.createdByUserId = req.user._id;
  return newQuestion.save()
    .then(function(question) {
        res.json(question);
    })
    .catch(validationError(res));
});

/**
 * Deletes a question
 */
router.delete('/:id', auth.isAuthenticated(), function(req, res) {
  return Question.findOne({
    attributes: ['createdByUserId'],
    where: {
      _id: req.params.id
    }
  })
    .then(function(question) {
      if(req.user._id == question.createdByUserId) 
        return question.destroy();
    })
    .catch(validationError(res))
    .then(function() {
      res.status(200).json("{'message': 'OK'}");
    });
});

module.exports = router;