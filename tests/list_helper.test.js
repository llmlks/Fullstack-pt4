const listHelper = require('../utils/list_helper')
const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

test('dummy is called', () => {
    expect(listHelper.dummy([])).toBe(1)
})

describe('Total likes', () => {
    const totalLikes = listHelper.totalLikes

    test('of empty list of blogs', () => {
        expect(totalLikes([])).toBe(0)
    })

    test('of list with one blog', () => {
        expect(totalLikes([blogs[0]])).toBe(blogs[0].likes)
    })

    test('of six blogs', () => {
        expect(totalLikes(blogs)).toBe(36)
    })
})

describe('Favourite blog', () => {
    const favouriteBlog = listHelper.favouriteBlog

    test('of empty list of blogs', () => {
        expect(favouriteBlog([])).toEqual({ })
    })

    test('of list with one blog', () => {
        expect(favouriteBlog([blogs[4]])).toEqual(blogs[4])
    })

    test('of list of six blogs', () => {
        expect(favouriteBlog(blogs)).toEqual(blogs[2])
    })
})

describe('Author with most blogs', () => {
    const mostBlogs = listHelper.mostBlogs

    test('of empty list of blogs', () => {
        expect(mostBlogs([])).toEqual({ })
    })

    test('of list with one blog', () => {
        expect(mostBlogs([blogs[2]])).toEqual(
            {
                author: blogs[2].author,
                blogs: 1
            }
        )
    })

    test('of list with six blogs', () => {
        expect(mostBlogs(blogs)).toEqual(
            {
                author: 'Robert C. Martin',
                blogs: 3
            }
        )
    })
})

describe('Author with most likes', () => {
    const mostLikes = listHelper.mostLikes

    test('of empty list of blogs', () => {
        expect(mostLikes([])).toEqual({ })
    })

    test('of list with one blog', () => {
        expect(mostLikes([blogs[0]])).toEqual(
            {
                author: blogs[0].author,
                likes: blogs[0].likes
            }
        )
    })

    test('of list with six blogs', () => {
        expect(mostLikes(blogs)).toEqual(
            {
                author: 'Edsger W. Dijkstra',
                likes: 17
            }
        )
    })
})