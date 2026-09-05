const errorHandler = (err, req, res, next) => {
    console.error('ERROR:', err.message)

    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        msg: err.message || 'Server Error'
    })
}

module.exports = errorHandler