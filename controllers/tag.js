'use strict';

var Tag = require('../models').Tag;

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
  return Tag.findAll().then(tags => { res.status(200).json(tags) })
                      .catch(handleError(res));
});

router.post('/', function(req, res) {
  var newTag = Tag.build(req.body);
  return newTag.save()
    .then(tag => {
        res.json(tag);
    })
    .catch(validationError(res));
});

module.exports = router;
