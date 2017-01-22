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
      'createdAt',
      'updatedAt',
      'negativeVotes',
      'QuestionId',
      "createdByUserId"
    ],
    where: {
      QuestionId: req.params.id
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

router.put('/votes/:id/thumbsup', auth.isAuthenticated(), function(req, res) {
  Answer.findOne({
    where: {
      _id: req.params.id
    }
  }).then(answer => {
    if(answer) {
      if(answer.createdByUserId != req.user._id){
        answer.getUsers().then(users => {
          var user = users.find(user => { return user._id == req.user._id });
          if(!user) {
            answer.positiveVotes += 1;
            answer.addUsers([req.user._id]);
            answer.save().then(answer => {
              res.status(200).json({vote: true});
            });
          }
          else {
            res.status(200).json({vote: false});
          }
        });
      }
    }
  });
});

router.put('/votes/:id/thumbsdown', auth.isAuthenticated(), function(req, res) {
  Answer.findOne({
    where: {
      _id: req.params.id
    }
  }).then(answer => {
    if(answer) {
      if(answer.createdByUserId != req.user._id) {
        answer.getUsers().then(users => {
          var user = users.find(user => { return user._id == req.user._id });
          if(!user) {
            answer.negativeVotes += 1;
            answer.addUsers([req.user._id]);
            answer.save().then(answer => {
              res.status(200).json({vote: true});
            });
          }
          else {
            res.status(200).json({vote: false});
          }
        });
     }
    }
  });
});

module.exports = router;
