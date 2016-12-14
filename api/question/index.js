'use strict';

var Router = require('express').Router;
var controller = require('./question.controller');

var router = new Router();

router.get('/', controller.index);
router.post('/', controller.create);

module.exports = router;