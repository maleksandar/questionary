'use strict';

var Pin = require('..models').Pin;
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

router.delete('/question/:id', auth.isAuthenticated(), (req, res) => {
  var userId = req.user._id;

});

router.post('/question/:id', auth.isAuthenticated(), (req, res) => {
  var userId = req.user._id;

});

router.get('/question/:id', auth.isAuthenticated(), (req, res) => {
  var userId = req.user._id;

});

router.get('/questions', auth.isAuthenticated(), (req, res) => {
  var userId = req.user._id;

});

module.exports = router;