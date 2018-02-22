const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initBlogs, blogsInDB, nonExistentBlogId, existingBlog } = require('./test_helper')

describe('When there are some blogs saved in DB initially', async () => {

    let token = null
    let user = null

    beforeAll(async () => {
        await User.remove({ })

        const userInit = {
            name: 'Molly Malone',
            username: 'Molly',
            password: 'Malone',
            ofAge: false
        }

        const userRes = await api.post('/api/users').send(userInit)
        user = userRes.body
        const loginRes = await api.post('/api/login').send({ username: userInit.username, password: userInit.password })
        token = `Bearer ${loginRes.body.token}`

        await Blog.remove({ })

        const blogObjects = initBlogs.map(blog => new Blog(blog))
        const promises = blogObjects.map(blog => blog.save())
        await Promise.all(promises)
    })

    afterAll(() => {
        server.close()
    })

    describe('GET method', async () => {
        test('all blogs are returned', async () => {
            const blogsBefore = await blogsInDB()
            const response = await api
                .get('/api/blogs')

            expect(response.body.length).toBe(blogsBefore.length)
        })

        test('a specific blog is among those returned', async () => {
            const response = await api
                .get('/api/blogs')

            const blogs = response.body.map(Blog.format)

            initBlogs.forEach(init => expect(blogs).toContainEqual(init))
        })
    })

    describe('POST method', async () => {

        test('a valid blog can be added', async () => {
            const blogsBefore = await blogsInDB()

            const newBlog = {
                title: 'Everything About Dynamic Programming',
                author: 'Karan2116',
                url: 'http://codeforces.com/blog/entry/43256',
                likes: 5
            }

            const response = await api
                .post('/api/blogs')
                .set('authorization', token)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogsInDB()

            expect(blogsAfter.length).toBe(blogsBefore.length + 1)
            expect(response.body.user).toEqual(user.id)
            expect(response.body.title).toBe(newBlog.title)
        })

        test('field \'likes\' defaults to zero', async () => {
            const blogsBefore = await blogsInDB()

            const newBlog = {
                title: 'Vue 2.5 released',
                author: 'Evan You',
                url: 'https://medium.com/the-vue-point/vue-2-5-released-14bd65bf030b'
            }

            const response = await api
                .post('/api/blogs')
                .set('authorization', token)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogsInDB()

            expect(blogsAfter.length).toBe(blogsBefore.length + 1)
            expect(response.body.title).toEqual(newBlog.title)
            expect(response.body.likes).toBe(0)
        })

        test('missing title field returns bad request', async () => {
            const blogsBefore = await blogsInDB()
            const newBlog = {
                author: 'Petr Mitrichev',
                url: 'http://petr-mitrichev.blogspot.com/',
                likes: 9
            }

            const response = await api
                .post('/api/blogs')
                .set('authorization', token)
                .send(newBlog)
                .expect(400)

            const blogsAfter = await blogsInDB()
            const urls = blogsAfter.map(blog => blog.url)

            expect(urls).not.toContain(newBlog.url)
            expect(blogsAfter.length).toBe(blogsBefore.length)
            expect(response.body).toEqual({
                error: `Title and url must be defined.
                    \n Title: undefined
                    \n URL: ${newBlog.url}`
            })
        })

        test('missing url field returns bad request', async () => {
            const blogsBefore = await blogsInDB()
            const newBlog = {
                title: 'Racial Bias in Facial Recognition Software',
                author: 'Stephanie Kim',
                likes: 12
            }

            const response = await api
                .post('/api/blogs')
                .set('authorization', token)
                .send(newBlog)
                .expect(400)

            const blogsAfter = await blogsInDB()
            const titles = blogsAfter.map(blog => blog.title)

            expect(blogsAfter.length).toBe(blogsBefore.length)
            expect(titles).not.toContain(newBlog.title)
            expect(response.body).toEqual({
                error: `Title and url must be defined.
                    \n Title: ${newBlog.title}
                    \n URL: undefined`
            })
        })
    })

    describe('DELETE method', async () => {

        test('an existing blog can be deleted from database', async () => {
            const blogToDelete = {
                title: 'Vue, Test Coverage, and Drag-and-Drop',
                author: 'Joe Zimmerman',
                url: 'https://www.joezimjs.com/javascript/vue-test-coverage-and-drag-and-drop/',
                likes: 4
            }

            const response = await api
                .post('/api/blogs')
                .set('authorization', token)
                .send(blogToDelete)

            const blogsBefore = await blogsInDB()

            await api
                .delete(`/api/blogs/${response.body.id.toString()}`)
                .set('authorization', token)
                .expect(204)

            const blogsAfter = await blogsInDB()
            const urlsBefore = blogsBefore.map(blog => blog.url)
            const urlsAfter = blogsAfter.map(blog => blog.url)

            expect(blogsAfter.length).toBe(blogsBefore.length - 1)
            expect(urlsBefore).toContainEqual(blogToDelete.url)
            expect(urlsAfter).not.toContainEqual(blogToDelete.url)
        })

        test('non-existent id returns bad request', async () => {
            const invalidId = await nonExistentBlogId()
            const blogsBefore = await blogsInDB()

            const response = await api
                .delete(`/api/blogs/${invalidId}`)
                .expect(400)

            const blogsAfter = await blogsInDB()

            expect(blogsAfter.length).toBe(blogsBefore.length)
            expect(response.body).toEqual({ error: `Malformatted id: ${invalidId}` })
        })

        test('blog can only be deleted by user who added it', async () => {
            const blogToDelete = {
                title: 'Vue, Test Coverage, and Drag-and-Drop',
                author: 'Joe Zimmerman',
                url: 'https://www.joezimjs.com/javascript/vue-test-coverage-and-drag-and-drop/',
                likes: 4
            }

            const toDelete = await api
                .post('/api/blogs')
                .set('authorization', token)
                .send(blogToDelete)

            const blogsBefore = await blogsInDB()

            const userInit = {
                name: 'Willy Wonka',
                username: 'Wonka',
                password: 'chocolate',
                ofAge: true
            }

            await api.post('/api/users').send(userInit)

            const loginRes = await api.post('/api/login').send({ username: userInit.username, password: userInit.password })
            const deletingToken = `Bearer ${loginRes.body.token}`

            const response = await api
                .delete(`/api/blogs/${toDelete.body.id.toString()}`)
                .set('authorization', deletingToken)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogsInDB()

            expect(blogsAfter.length).toBe(blogsBefore.length)
            expect(response.body).toEqual({ error: 'Operation not authorised' })
        })
    })

    describe('PUT method', async () => {

        test('title of an existing blog can be updated', async () => {
            const blogToUpdate = await existingBlog()
            const updatedBlog = blogToUpdate
            updatedBlog.title = 'A New Better Title'

            const blogsBefore = await blogsInDB()

            await api
                .put(`/api/blogs/${blogToUpdate._id.toString()}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogsInDB()
            updatedBlog._id = blogToUpdate._id
            const formattedUpdated = Blog.format(new Blog(updatedBlog))

            expect(blogsAfter.length).toBe(blogsBefore.length)
            expect(blogsAfter).toContainEqual(formattedUpdated)
            expect(blogsAfter).not.toContainEqual(blogToUpdate)
        })

        test('all information of an existing blog can be updated', async () => {
            const blogToUpdate = await existingBlog()
            const updatedBlog = {
                author: 'U. P. Dated',
                title: 'A New Better Title',
                url: 'http://betterurl.com',
                likes: blogToUpdate.likes + 2
            }

            const blogsBefore = await blogsInDB()

            await api
                .put(`/api/blogs/${blogToUpdate._id.toString()}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogsInDB()
            updatedBlog._id = blogToUpdate._id
            const formattedUpdated = Blog.format(new Blog(updatedBlog))

            expect(blogsAfter.length).toBe(blogsBefore.length)
            expect(blogsAfter).toContainEqual(formattedUpdated)
            expect(blogsAfter).not.toContainEqual(blogToUpdate)
        })

        test('a non-existent id returns bad request', async () => {
            const invalidId = await nonExistentBlogId()
            const updatedBlog = {
                author: 'U. P. Dated',
                title: 'A New Better Title',
                url: 'http://betterurl.com',
                likes: 2
            }

            const blogsBefore = await blogsInDB()

            await api
                .put(`/api/blogs/${invalidId}`)
                .send(updatedBlog)
                .expect(400)

            const blogsAfter = await blogsInDB()
            updatedBlog._id = invalidId
            const formattedUpdated = Blog.format(new Blog(updatedBlog))

            expect(blogsAfter.length).toBe(blogsBefore.length)
            expect(blogsAfter).not.toContainEqual(formattedUpdated)
        })
    })
})