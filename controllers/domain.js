'use strict';

var Domain = require('../models').Domain;
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

router.post('/', auth.hasRole('admin'), (req, res) => {
  Domain.create(req.body)
    .then(domain => {
      res.json(domain);
    })
    .catch(validationError(res));
});

router.get('/', (req, res) => {
  Domain.findAll({})
    .then(domains => {
      res.json(domains);
    })
    .catch(handleError(res));
});

router.delete('/:text', auth.hasRole('admin'), (req, res) => {
  Domain.destroy({ where: { text: req.params.text }})
    .then(numberOfDomains => {
      if(!numberOfDomains) {
        return res.status(404).send(`There is no domain with text: ${req.params.text}`);
      }
      res.status(200).send(`Domain ${req.params.text} deleted`);
    }).catch(handleError(res));
});

module.exports = router;
