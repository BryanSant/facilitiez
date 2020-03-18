const express = require('express')
const app = express()
const port = 3000

const ExampleController = require('./controllers/example')
const exampleController = new ExampleController()

app.use(function(req, res, next) {
    console.log(`${req.method} ${req.path}`)
    next()
})

app.get('/', function(req, res) {
    return res.json({"message": "success"})
})

app.get('/example', exampleController.get)

console.log(`Listening on port ${port}`)
app.listen(port)
