const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog
            .find({ })
            .populate('user', { name: 1, username: 1, _id: 1 })

        response.json(blogs.map(Blog.format))
    } catch (exception) {
        console.log(exception)
        response.status(500).send({ error: 'Something went wrong..' })
    }
})

blogsRouter.post('/', async (request, response) => {
    try {
        const body = request.body
        const token = request.token
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).send({ error: 'Token missing or invalid' })
        }

        if (body.title === undefined || body.url === undefined) {
            return response.status(400).send({
                error: `Title and url must be defined.
                    \n Title: ${body.title}
                    \n URL: ${body.url}`
            })
        }

        let likes = body.likes
        if (likes === undefined) {
            likes = 0
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: likes,
            user: user._id
        })

        const res = await blog.save()

        user.blogs = user.blogs.concat(res._id)
        await user.save()

        response.status(201).json(Blog.format(res))
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).send({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).send({ error: 'Something went wrong.. ' })
        }
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        const toBeRemoved = await Blog.findById(request.params.id)

        if (toBeRemoved === null || toBeRemoved === undefined) {
            return response.status(400).send({ error: `Malformatted id: ${request.params.id}` })
        }

        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (decodedToken.id.toString() !== toBeRemoved.user.toString()) {
            return response.status(401).send({ error: 'Operation not authorised' })
        }

        await toBeRemoved.remove()

        response.status(204).end()
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).send({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).send({ error: 'Something went wrong.. ' })
        }
    }
})

blogsRouter.put('/:id', async (request, response) => {
    try {
        const updatedBlog = {
            author: request.body.author,
            title: request.body.title,
            url: request.body.url,
            likes: request.body.likes
        }
        const options = { new: true }
        const newBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, options)

        if (newBlog === null || newBlog === undefined) {
            return response.status(400).send({ error: `Malformatted id: ${request.params.id}` })
        }

        response.json(newBlog)
    } catch (exception) {
        console.log(exception)
        response.status(500).send({ error: 'Something went wrong..' })
    }
})

module.exports = blogsRouter