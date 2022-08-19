const express = require('express')
const showsRouter = express.Router()
const {check, validationResult} = require('express-validator')
const { Show, User, WatchedList } = require('../models');
const { Op } = require('sequelize');

showsRouter.get('/', (req, res) => {
    res.sendStatus(200)
})

module.exports = {showsRouter}



