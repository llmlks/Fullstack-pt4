let token = null

const testUser = {
    username: 'TestUser',
    name: 'Test User',
    token: '112358132134',
    _id: '5a89d67de0d9467f5f4c4185'
}

const blogs = [
    {
        id: '5a451e21e0b8b04a45638211',
        title: 'Continous Integration',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com',
        likes: 5,
        user: {
            _id: testUser._id,
            username: testUser.username,
            name: testUser.name
        }
    },
    {
        id: '5a451df7571c224a31b5c8ce',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 3,
        user: {
            _id: testUser._id,
            username: testUser.username,
            name: testUser.name
        }
    },
    {
        id :'5a451e30b5ffd44a58fa79ab',
        title: 'Canonical string reduction',
        author: 'Edsger Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 4,
        user: {
            _id: '5a8c73ee85d9ba614a6b98fa',
            username: 'Bouquet',
            name: 'Hyacinth'
        }
    }
]

const setToken = (newToken) => {
    token = newToken
}

const getAll = () => {
    return Promise.resolve(blogs)
}

export default { getAll, blogs, testUser, setToken }