const Blog = require('../models/blog')
const User = require('../models/user')

const initBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }
]

const blogsInDB = async () => {
    const blogs = await Blog.find({ })
    return blogs.map(Blog.format)
}

const nonExistentBlogId = async () => {
    const blog = new Blog()
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const existingBlog = async () => {
    const blog = new Blog({
        author: 'Sander Rossel',
        title: 'KISS — One Best Practice to Rule Them All',
        url: 'https://simpleprogrammer.com/kiss-one-best-practice-to-rule-them-all/',
        likes: 6
    })
    await blog.save()
    return blog
}

const initUsers = [
    {
        name: 'Janis Joplin',
        username: 'JJSoCo',
        ofAge: true,
        password: 'mercedes'
    },
    {
        name: 'Genghis Khan',
        username: 'Khan',
        ofAge: false,
        password: 'genghis'
    }
]

const usersInDB = async () => {
    const users = await User.find({ })
    return users.map(User.format)
}

module.exports = {
    initUsers,
    initBlogs,
    usersInDB,
    blogsInDB,
    nonExistentBlogId,
    existingBlog
}