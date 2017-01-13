'use strict';

var Question = require('../models').Question;
var Tag = require('../models').Tag;
var TagQuestion = require('../models').TagQuestion;
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

router.get('/', function(req, res) {
  var filter = {};
  if(req.query.questiontext) {
    filter.$or = [
      { headline: { $like: `%${req.query.questiontext}%` } },
      { text: { $like: `%${req.query.questiontext}%` } }
    ]
  }

  return Question.findAll({

    include: [TagQuestion],
    where: filter,
    limit: parseInt(req.query.limit) || 5,
    offset: parseInt(req.query.offset) || 0
  })
    .then(questions => {
      res.status(200).json(questions);
    })
    .catch(handleError(res));
});

router.get('/:id', function(req, res) {
  return Question.findOne({ include: [TagQuestion], where: { _id: req.params.id } })
    .then(question => {
      if(!question) {
        return res.status(404).end();
      }
      res.json(question);
    }).catch(handleError(res));
});

router.post('/', auth.isAuthenticated(), function(req, res) {
  var newQuestion = Question.build(req.body);
  newQuestion.createdByUserId = req.user._id;
  return newQuestion.save()
    .then(function(question) {
      if(req.body.Tags) {
        Tag.bulkCreate(req.body.Tags, { ignoreDuplicates: true })
          .then((tags) => {
            var tagQuestions = [];
            tags.forEach((tag)=> tagQuestions.push({ QuestionId: newQuestion._id, TagText: tag.text }));
            TagQuestion.bulkCreate(tagQuestions, { ignoreDuplicates: true })
              .then(() => {
                res.json(question);
              });
          });
      } else {
        res.json(question);
      }
    })
    .catch(validationError(res));
});

module.exports = router;
