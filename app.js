const express = require('express');
const {showsRouter, usersRouter} = require('./routes')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use('/shows', showsRouter)
app.use('/users', usersRouter)

app.get('/', async (req, res)=>{
    res.sendStatus(200);
})

app.listen(port, ()=>{
    console.log(`The server is live and listening at http://localhost:${port}`)
});