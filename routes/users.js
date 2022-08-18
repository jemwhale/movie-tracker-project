const express = require('express')
const usersRouter = express.Router()
const {check, validationResult} = require('express-validator')
const { Show, User, WatchedList } = require('../models');
const {Sequelize, Op} = require('./index')

usersRouter.get('/', (req, res) => {
    res.sendStatus(200)
})

module.exports = {usersRouter}