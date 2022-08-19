const express = require('express')
const usersRouter = express.Router()
const {check, validationResult} = require('express-validator')
const { Show, User, WatchedList } = require('../models');
const { Op } = require('sequelize');

usersRouter.get('/', (req, res) => {
    res.sendStatus(200)
})

module.exports = {usersRouter}