'use strict';

var Pin = require('../models').Pin;
var Question = require('../models').Question;
var auth = require('../auth/auth.service');
var Router = require('express').Router;

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

router.delete('/question/:id', auth.isAuthenticated(), (req, res) => {
  var userId = req.user._id;
  Pin.destroy({ where: { QuestionId : parseInt(req.params.id), UserId: userId } })
    .then((numberOfPins) => {
      if(!numberOfPins) {
        return res.status(404).send(`There are no pinned questions with given params`);
      }
      res.status(200).send(` deleted: (Q: ${req.params.id}, U: ${userId}`);
    }).catch(handleError(res));
});

router.post('/question/:id', auth.isAuthenticated(), (req, res) => {
  Question.findById(parseInt(req.params.id)).then(question => {
    Pin.create({ QuestionId: parseInt(req.params.id), UserId: req.user._id })
      .then(pin => {
        res.json(pin);
      })
      .catch(validationError(res));
  }).catch(handleError(res));
});

router.get('/question/:id', auth.isAuthenticated(), (req, res) => {
  var userId = req.user._id;
  Pin.findOne({ where: { QuestionId: parseInt(req.params.id), UserId: userId} }).then(question => {
    if(question){
      return res.send(true);
    }
    else {
      return res.send(false);
    }
  }).catch(() => { return res.send(false)});
});

module.exports = router;