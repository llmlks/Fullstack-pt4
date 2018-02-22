if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

let mongoUrl = process.env.MONGODB_URI
let port = process.env.PORT

if (process.env.NODE_ENV === 'test') {
    mongoUrl = process.env.TEST_MONGODB_URI
    port = process.env.TEST_PORT
}

module.exports = {
    mongoUrl,
    port
}
