'use strict';

var Question = require('../models').Question;
var Tag = require('../models').Tag;
var Answer = require('../models').Answer;
var User = require('../models').User;
var TagQuestion = require('../models').TagQuestion;
var config = require ('../config');
var Router = require('express').Router;
var auth = require('../auth/auth.service');
var _ = require('lodash');

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

router.get('/user/:id', (req, res) => {
   return Question.findAll({
    include: getAdditionalInfoFilters(req.query.include),
    where: { createdByUserId: req.params.id },
    limit: parseInt(req.query.limit) || 5,
    offset: parseInt(req.query.offset) || 0
  })
    .then(questions => {
      res.status(200).json(questions);
    })
    .catch(handleError(res));
});

// router.get('/pinned', (req, res) => {
//    return Question.findAll({
//     include: getAdditionalInfoFilters(req.query.include),
//     where: { createdByUserId: req.params.id },
//     limit: parseInt(req.query.limit) || 5,
//     offset: parseInt(req.query.offset) || 0
//   })
//     .then(questions => {
//       res.status(200).json(questions);
//     })
//     .catch(handleError(res));
// });


router.get('/', function(req, res) {
  var filter = {};
  if(req.query.questiontext) {
    filter.$or = [
      { headline: { $like: `%${req.query.questiontext}%` } },
      { text: { $like: `%${req.query.questiontext}%` } }
    ]
  }

  return Question.findAll({
    include: getAdditionalInfoFilters(req.query.include),
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
  return Question.findOne({ include: getAdditionalInfoFilters(req.query.include), where: { _id: req.params.id } })
    .then(question => {
      if(!question) {
        return res.status(404).end();
      }
      res.json(question);
    }).catch(handleError(res));
});

router.delete('/:id', auth.isAuthenticated(), function(req, res) {
  var userId = req.user._id;
  return Question.destroy({ where: { _id: req.params.id, createdByUserId: userId } })
    .then((numberOfQuestions )=> {
      if(!numberOfQuestions) {
        return res.status(404).send(`There is no question with id: ${req.params.id}`);
      }
      res.status(200).send(`Question deleted: ${req.params.id}`);
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
            // todo: refactor v refactor so it functions for both postgress and mysql
            if(typeof tags === "string")
              tags = [ tags ];
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

function getAdditionalInfoFilters(queryFilter) {
  if(typeof queryFilter === "string"){
    queryFilter = [ queryFilter ];
  }
  var additionalInfoFilters = [];
  if(_.includes(queryFilter, "Tags") || _.includes(queryFilter, "tags"))
    additionalInfoFilters.push(TagQuestion);
  if(_.includes(queryFilter, "Answers") || _.includes(queryFilter, "answers"))
    additionalInfoFilters.push(Answer);
  
  return additionalInfoFilters;
}

module.exports = router;
