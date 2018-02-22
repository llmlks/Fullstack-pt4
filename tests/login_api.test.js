const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { initUsers } = require('../tests/test_helper')

describe('Tests for login API', async () => {

    beforeAll(async () => {
        await User.remove({ })

        const promises = initUsers.map(user => api.post('/api/users').send(user))
        await Promise.all(promises)
    })

    afterAll(() => {
        server.close()
    })

    test('Login succeeds with valid username and password', async () => {
        const user = initUsers[0]

        const response = await api
            .post('/api/login')
            .send({ username: user.username, password: user.password })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.name).toBe(user.name)
        expect(response.body.username).toBe(user.username)
        expect(response.body.token).not.toBe(null)
        expect(response.body.token).not.toBe(undefined)
    })

    test('Login fails with nonexistent username', async () => {
        const user = {
            username: 'Marilyn',
            password: 'Monroe'
        }

        const response = await api
            .post('/api/login')
            .send({ username: user.username, password: user.password })
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'Invalid username or password' })
        expect(response.body.token).toBe(undefined)
    })

    test('Login fails with incorrect password', async () => {
        const user = initUsers[0]

        const response = await api
            .post('/api/login')
            .send({ username: user.username, password: 'wrongPassword' })
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'Invalid username or password' })
        expect(response.body.token).toBe(undefined)
    })
})