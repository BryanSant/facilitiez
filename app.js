const express = require('express')
const app = express()
const port = 3000

const ExampleController = require('./controllers/example')
const RoomsController = require('./controllers/rooms')
const FloorsController = require('./controllers/floors')
const CubiclesController = require('./controllers/cubicles')

const exampleController = new ExampleController()
const roomsController = new RoomsController()
const floorsController = new FloorsController()
const cubiclesController = new CubiclesController()

app.use(function(req, res, next) {
    console.log(`${req.method} ${req.path}`)
    next()
})

app.get('/', function(req, res) {
    return res.json({"message": "success"})
})

app.get('/example', exampleController.get)
app.get('/rooms', roomsController.get)
app.get('/rooms/:roomId', roomsController.getById)
app.get('/floors', floorsController.get)
app.get('/floors/:floorId', floorsController.getById)
app.get('/cubicles', cubiclesController.get)
app.get('/cubicles/:cubicleId', cubiclesController.getById)

console.log(`Listening on port ${port}`)
app.listen(port)
