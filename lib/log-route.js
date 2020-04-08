module.exports = (req, res, next) => {

    console.log(`${req.session.id} - [${req.path}] - ${JSON.stringify(req.session)}`)

    next()
}