const express = require('express')
const usersRouter = express.Router()
const {check, validationResult} = require('express-validator')
const { Show, User, WatchedList } = require('../models');
const { Op } = require('sequelize');


//Get all users
usersRouter.get('/', async (req, res) => {
    const allUsers = await User.findAll()
    res.send(allUsers)
})

//Get key of all users 
usersRouter.get('/all/:key', async (req, res) => {
    const allUsers = await User.findAll()
    
    const payload = allUsers.map((x) => {
        return x[req.params.key.toLowerCase()]
    })
    res.send(payload)
})

//Get one user by id
usersRouter.get('/id/:id', async (req, res) => {
    const queriedId = await User.findByPk(req.params.id)
    if (!queriedId){
        res.status(400).send("No user found by that id!")
        return
    }else{
        let {id, name, email} = queriedId
        let payload = {
            id: id,
            name: name,
            email: email
        }
        res.send(payload);
    }
})

//Get one user by name 
usersRouter.get('/name/:name', async (req, res) => {
    const newStr = req.params.name.replace('-',' ')
    newStr = newStr.toLowerCase()
    const queriedName = await User.findOne({
        where: {
            name: newStr
        }
    })
    if (!queriedName){
        res.status(400).send("No user found by that name! Please make sure you have used the correct case!")
        return
    }else{
        let {id, name, email} = queriedName
        let payload = {
            id: id,
            name: name,
            email: email
        }
        res.send(payload);
    }
})


//Get shows watched by a user
    //FORMAT AS JSON IF TIME
usersRouter.get('/watched/:id', async (req, res) => {
    const queriedId = await User.findByPk(req.params.id)
    if (!queriedId){
        res.status(400).send("No user found by that id!")
        return
    }else{
        const payload = await WatchedList.findAll({
            where: {
                userid: req.params.id
            }
        })
    
        if (payload.length === 0){
            res.status(200).send("This user has watched no shows!")
            return
        }else{
            res.send(payload);
        }
    }
})

//Get all unrated shows from a user's watched list
    //FORMAT AS JSON IF TIME
usersRouter.get('/unrated/:id', async (req, res) => {
    const queriedId = await User.findByPk(req.params.id)
    if (!queriedId){
        res.status(400).send("No user found by that id!")
        return
    }else{
        const payload = await WatchedList.findAll({
            where: {
                userid: req.params.id,
                rating: null
            }
        })
        if (payload.length === 0){
            res.status(200).send("This user has no unrated watched shows!")
            return
        }else{
            res.send(payload);
        }
    }
})

//Get all rated shows from a user's watched list
    //FORMAT AS JSON IF TIME
usersRouter.get('/rated/:id', async (req, res) => {
    const queriedId = await User.findByPk(req.params.id)
    if (!queriedId){
        res.status(400).send("No user found by that id!")
        return
    }else{
        const payload = await WatchedList.findAll({
            where: {
                userid: req.params.id,
                rating: {
                    [Op.gt]: -1
                }
            }
        })
        if (payload.length === 0){
            res.status(200).send("This user has no watched shows with a rating!")
            return
        }else{
            res.send(payload);
        }
    }
})

//Get all shows from a user's watched list rated >= input
    //FORMAT AS JSON IF TIME
usersRouter.get('/rated/:id/:rating', async (req, res) => {
    const queriedRating = parseInt(req.params.rating)
    const queriedId = await User.findByPk(req.params.id)
    if (!queriedId){
        res.status(400).send("No user found by that id!")
        return
    }else{
        const payload = await WatchedList.findAll({
            where: {
                userid: req.params.id,
                rating: {
                    [Op.gt]: queriedRating
                }
            }
        })
        if (payload.length === 0){
            res.status(200).send("This user has no watched shows with a rating higher than that!")
            return
        }else{
            res.send(payload);
        }
    }
})

//Add show to a users watched list
usersRouter.post('/add-to-watched', [check('userId').not().trim().isEmpty(), check('showId').not().trim().isEmpty()], async (req, res) => {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({error: errors.array()})
        return 
    }

    const queriedUser = await User.findByPk(req.body.userId)
    const queriedShow = await Show.findByPk(req.body.showId)
    const alreadyAddedCheck = await WatchedList.findOne({
        where: {
            userId: req.body.userId,
            showId: req.body.showId
        }
    })
    if (!queriedUser){
        res.status(400).send("No user found by that id!")
        return
    }else if(!queriedShow){
        res.status(400).send("No show found by that id!")
        return
    }else if(alreadyAddedCheck){
        res.status(200).send("This show is already on this users watched list!")
        return
    }else{
        await queriedUser.addShow(queriedShow)
        res.status(200).send("Show has successfully been added to this user's watched list!")
    }
})

//Add a user

usersRouter.post('/create', [check('name').toLowerCase().not().trim().isEmpty(), check('email').toLowerCase().not().trim().isEmpty()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({error: errors.array()})
        return 
    }
    const queriedUser = await User.findOne({
        where: {
            name: req.body.name
        }
    })
    if (queriedUser){
        res.status(200).send("A user with this name already exists!")
        return
    }
    await User.create(req.body)
    res.status(200).send("New user has been created successfully!")
})

//Delete a user

usersRouter.delete('/delete', [check('id').toLowerCase().not().trim().isEmpty()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({error: errors.array()})
        return 
    }
    const queriedUser = await User.findByPk(req.body.id)
    if (!queriedUser){
        res.status(400).send("No user found by that id!")
        return
    }
    await queriedUser.destroy()
    res.status(200).send("User has been successfully deleted!")
})

module.exports = {usersRouter}