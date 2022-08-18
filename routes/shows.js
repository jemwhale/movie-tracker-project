const express = require('express')
const showsRouter = express.Router()
const {check, validationResult} = require('express-validator')
const { Show } = require('../models');

showsRouter.get('/', (req, res) => {
    res.sendStatus(200)
})

module.exports = {showsRouter}



