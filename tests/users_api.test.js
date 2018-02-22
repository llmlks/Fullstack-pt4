const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { initUsers, usersInDB } = require('./test_helper')

describe('Tests for users API', async () => {

    beforeAll(async () => {
        await User.remove({ })

        const promises = initUsers.map(user => api.post('/api/users').send(user))
        await Promise.all(promises)
    })

    afterAll(() => {
        server.close()
    })

    describe('POST method', async () => {
        test('succeeds with a valid unused password and username', async () => {
            const usersBefore = await usersInDB()
            const newUser = {
                name: 'Marc Anthony',
                username: 'Macca',
                ofAge: false,
                password: 'kleopatra'
            }

            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAfter = await usersInDB()

            const usernames = usersAfter.map(user => user.username)
            expect(usernames).toContain(newUser.username)
            expect(response.body.name).toBe(newUser.name)
            expect(response.body.username).toBe(newUser.username)
            expect(usersAfter.length).toBeGreaterThanOrEqual(usersBefore.length)
        })

        test('field ofAge defaults to true if not defined', async () => {
            const usersBefore = await usersInDB()
            const newUser = {
                name: 'Hyacinth',
                username: 'Bouquet',
                password: 'lady'
            }

            const res = await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAfter = await usersInDB()

            expect(usersAfter.length).toBeGreaterThanOrEqual(usersBefore.length + 1)
            expect(res.body.ofAge).toBe(true)
        })

        test('fails when a username has been taken', async () => {
            const usersBefore = await usersInDB()
            const newUser = {
                name: 'Jim Jones',
                username: 'JJSoCo',
                ofAge: false,
                password: 'sunChurch'
            }

            const res = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAfter = await usersInDB()
            expect(usersAfter.length).toBe(usersBefore.length)
            expect(res.body).toEqual({ error: 'Username must be unique' })
        })

        test('fails when password is less than 3 characters', async () => {
            const usersBefore = await usersInDB()
            const newUser = {
                name: 'Minna Canth',
                username: 'MC',
                ofAge: true,
                password: 'mc'
            }

            const res = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAfter = await usersInDB()
            expect(usersAfter.length).toBe(usersBefore.length)
            expect(res.body).toEqual({ error: 'Password must be at least 3 characters long' })
        })
    })

    describe('GET method', async () => {
        test('returns all users in the database', async () => {
            const usersBefore = await usersInDB()

            const response = await api
                .get('/api/users')

            expect(response.body.length).toBe(usersBefore.length)
        })

        test('a specific user is among those returned', async () => {
            const response = await api
                .get('/api/users')

            const usernames = response.body.map(user => user.username)
            initUsers.forEach(user => expect(usernames).toContain(user.username))
        })
    })
})