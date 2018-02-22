const dummy = (blogs) => {
    return blogs.length === 1 ? blogs.length : 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    const reducer = (max, blog) => {
        return blog.likes > max.likes ? blog : max
    }

    return blogs.length === 0
        ? { }
        : blogs.reduce(reducer, { likes: -1 })
}

const mostBlogs = (blogs) => {
    const mapAuthors = (authors, blog) => {
        const author = blog.author
        if (author in authors) {
            authors[author]++
        } else {
            authors[author] = 1
        }
        return authors
    }

    const authors = blogs.reduce(mapAuthors, { })

    const findMax = (max, blog) => {
        const author = blog.author
        const blogs = authors[author]
        return max.blogs > blogs
            ? max
            : {
                author: author,
                blogs: blogs
            }
    }

    return blogs.length === 0 ?
        { }
        : blogs.reduce(findMax, { blogs: -1 })
}

const mostLikes = (blogs) => {
    const mapAuthors = (authors, blog) => {
        const author = blog.author
        if (author in authors) {
            authors[author] += blog.likes
        } else {
            authors[author] = blog.likes
        }
        return authors
    }

    const authors = blogs.reduce(mapAuthors, { })

    const findMax = (max, blog) => {
        const author = blog.author
        const likes = authors[author]
        return max.likes > likes
            ? max
            : {
                author: author,
                likes: likes
            }
    }

    return blogs.length === 0 ?
        { }
        : blogs.reduce(findMax, { likes: -1 })
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}