const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const connect = async () => {
    try {
        mongoose.connect(config.mongoUrl)
        console.log('Connected to database', config.mongoUrl)
    } catch (exception) {
        console.log(exception)
    }
}

connect()
mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.set('json spaces', 4)
app.use(middleware.logger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.error)

const server = http.createServer(app)

if (!module.parent) {
    server.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`)
    })
}

server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app,
    server
}