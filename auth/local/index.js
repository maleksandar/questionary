'use strict';

var express = require('express');
var passport = require('passport');
var authService = require('../auth.service');
var signToken = authService.signToken;
var User = require('../../models').User;

require('./passport').setup(User);

var router = express.Router();

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if(error) {
      return res.status(401).json(error);
    }
    if(!user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    var token = signToken(user._id, user.role);
    // TODO: add Secure; for prod!
    res.cookie('access_token', token, { httpOnly: true /*, secure: true */});
    res.json({ access_token: token });
  })(req, res, next);
});

router.post('/logout', authService.isAuthenticated(), function(req, res, next) {
    res.cookie('access_token', 'LOGED_OUT', { httpOnly: true /*, secure: true */});
    res.end();
});

module.exports = router;