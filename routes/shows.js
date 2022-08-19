const express = require('express')
const showsRouter = express.Router()
const {check, validationResult} = require('express-validator')
const { Show, User, WatchedList } = require('../models');
const { Op } = require('sequelize');



//Get all shows
showsRouter.get('/', async (req, res) => {
    const allShows = await Show.findAll()
    res.send(allShows)
})

//Get key of all shows
showsRouter.get('/all/:key', async (req, res) => {
    const allShows = await Show.findAll()
    
    const payload = allShows.map((x) => {
        return x[req.params.key.toLowerCase()]
    })
    res.send(payload)
})

//Get one show by id
showsRouter.get('/id/:id', async (req, res) => {
    const queriedId = await Show.findByPk(req.params.id)
    if (!queriedId){
        res.status(400).send("No show found by that id!")
        return
    }else{
        let {id, title, genre} = queriedId
        let payload = {
            id: id,
            title: title,
            genre: genre
        }
        res.send(payload);
    }
})

//Get one show by title
showsRouter.get('/title/:title', async (req, res) => {
    const newStr = req.params.title.replace('-',' ')
    newStr = newStr.toLowerCase()
    const queriedTitle = await Show.findOne({
        where: {
            title: newStr
        }
    })
    if (!queriedTitle){
        res.status(400).send("No show found with that title! Please make sure you have used the correct case!")
        return
    }else{
        let {id, title, genre} = queriedTitle
        let payload = {
            id: id,
            title: title,
            genre: genre
        }
        res.send(payload);
    }
})

//Get all shows by genre
    //SEND A NEATER JSON 
showsRouter.get('/genre/:genre', async (req, res) => {

    let allShows = await Show.findAll() 
    let payload = allShows.filter((x) => {
        if(x.genre.includes(req.params.genre.toLowerCase())){
            return true
        }   
    })

    if (payload.length === 0){
        res.status(400).send("No shows found for that genre!")
        return
    }else{
        res.send(payload);
    }
})


//Add genres to a show
showsRouter.put('/add-genres', [check('showId').not().trim().isEmpty(), check('genre').not().isEmpty(), check('genre').isArray()], async (req, res) => {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({error: errors.array()})
        return 
    }

    const queriedShow = await Show.findByPk(req.body.showId)

    if(!queriedShow){
        res.status(400).send("No show found by that id!")
        return
    }else{
        // Don't add dupicates
        let payload = queriedShow.genre.split(',')
        for (each in req.body.genre){
            if (!payload.includes(req.body.genre[each].toLowerCase())){
                payload.push(req.body.genre[each].toLowerCase())
            }
        }
        queriedShow.update({
            genre: payload
        })
        res.status(200).send("Show genres have successfully been updated!")
    }
})

//Delete genres from a show
showsRouter.put('/remove-genres', [check('showId').not().trim().isEmpty(), check('genre').not().isEmpty(), check('genre').isArray()], async (req, res) => {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({error: errors.array()})
        return 
    }

    const queriedShow = await Show.findByPk(req.body.showId)

    if(!queriedShow){
        res.status(400).send("No show found by that id!")
        return
    }else{
        // Don't add dupicates
        let payload = queriedShow.genre.split(',')
        for (each in req.body.genre){
            if (payload.includes(req.body.genre[each].toLowerCase())){
                for(x in payload){
                    if (payload[x] === req.body.genre[each].toLowerCase()){
                        payload.splice(x,1)
                    }
                }
                
            }
        }
        queriedShow.update({
            genre: payload
        })
        res.status(200).send("Show genres have successfully been updated!")
    }
})

//Update a rating on a show that a user has watched
showsRouter.put('/rate', [check('userId').not().trim().isEmpty(), check('showId').not().trim().isEmpty(), check('rating').not().isEmpty(), check('rating').isInt({min: 0, max: 10})], async (req, res) => {
    
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
    }else if(!alreadyAddedCheck){
        res.status(400).send("Please add this show to your watched list in order to assign a rating!")
        return
    }else{
        alreadyAddedCheck.update({
            rating: req.body.rating
        })
        res.status(200).send("Show rating has successfully been updated!")
    }
})



//Add a show

showsRouter.post('/create', [check('title').toLowerCase().not().trim().isEmpty(), check('genre').isEmpty(), check('genre').isArray()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({error: errors.array()})
        return 
    }
    const queriedShow = await Show.findOne({
        where: {
            title: req.body.title
        }
    })
    if (queriedShow){
        res.status(200).send("A show with this name already exists!")
        return
    }
    await Show.create(req.body)
    res.status(200).send("New show has been created successfully!")
})

//Delete a show

showsRouter.delete('/delete', [check('id').toLowerCase().not().trim().isEmpty()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({error: errors.array()})
        return 
    }
    const queriedShow = await Show.findByPk(req.body.id)
    if (!queriedShow){
        res.status(400).send("No show found by that id!")
        return
    }
    await queriedShow.destroy()
    res.status(200).send("Show has been successfully deleted!")
})





module.exports = {showsRouter}



