const express = require('express')
const usersRouter = express.Router()
const {check, validationResult} = require('express-validator')
const { User } = require('../models');

usersRouter.get('/', (req, res) => {
    res.sendStatus(200)
})

module.exports = {usersRouter}