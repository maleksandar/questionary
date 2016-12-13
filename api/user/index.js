'use strict';

var Router = require('express').Router;
var controller = require('./user.controller');

var router = new Router();

router.get('/', controller.index);

module.exports = router;
