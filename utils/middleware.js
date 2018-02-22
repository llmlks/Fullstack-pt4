const logger = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        return next()
    }
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('-----------------')
    next()
}

const error = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
    const auth = request.get('authorization')
    let token = null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        token = auth.substring(7)
    }
    request.token = token
    next()
}

module.exports = {
    logger,
    error,
    tokenExtractor
}