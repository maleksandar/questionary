'use strict';

var Sequelize = require('sequelize');

var db = {
  Sequelize,
  sequelize: new Sequelize('postgres://dev:123456@localhost:5432/node_dev')
};

// Insert models below
// db.User = db.sequelize.import('../api/user/user.model');
// db.Question = db.sequelize.import('../api/question/question.model');

module.exports = db;