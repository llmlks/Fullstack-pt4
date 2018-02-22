const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const user = await User.findOne({ username: body.username })
        const passwordOK = user === null ?
            false
            : await bcrypt.compare(body.password, user.passwordHash)

        if (!(user && passwordOK)) {
            return response.status(401).send({ error: 'Invalid username or password' })
        }

        const tokenUser = {
            username: user.username,
            id: user._id
        }

        const token = jwt.sign(tokenUser, process.env.SECRET)

        response.status(200).send({ token, username: user.username, name: user.name })
    } catch (exception) {
        console.log(exception)
        response.status(500).send({ error: 'Something went wrong..' })
    }
})

module.exports = loginRouter