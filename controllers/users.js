const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({ }).populate('blogs', { author: 1, title: 1, url: 1, likes: 1, _id: 1 })

        response.json(users.map(User.format))

    } catch (exception) {
        console.log(exception)
        response.status(500).send({ error: 'Something went wrong..' })
    }
})

usersRouter.post('/', async (request, response) => {
    try {
        const name = request.body.name
        const username = request.body.username
        let ofAge = request.body.ofAge
        const password = request.body.password

        if (password === undefined || password.length < 3) {
            return response.status(400).send({ error: 'Password must be at least 3 characters long' })
        }

        const existing = await User.findOne({ username: username })

        if (existing) {
            return response.status(400).send({ error: 'Username must be unique' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        if (ofAge === undefined) {
            ofAge = true
        }

        const user = new User({
            name: name,
            username: username,
            ofAge: ofAge,
            passwordHash
        })

        const savedUser = await user.save()

        response.status(201).json(User.format(savedUser))
    } catch (exception) {
        console.log(exception)
        response.status(500).send({ error: 'Something went wrong..' })
    }
})

module.exports = usersRouter