const {showsRouter} = require('./shows')
const {usersRouter} = require('./users')
const { Sequelize, Op } = require('sequelize');

module.exports = {showsRouter, usersRouter, Sequelize, Op}