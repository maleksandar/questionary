'use strict';

var Router = require('express').Router;
var controller = require('./user.controller');

var router = new Router();

router.get('/', controller.index);
router.delete('/:id', controller.destroy);
router.get('/me', controller.me);
router.put('/:id/password', controller.changePassword);
router.get('/:id', controller.show);
router.post('/', controller.create);

module.exports = router;
