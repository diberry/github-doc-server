module.exports = (req, res, next) => {

    //req.session.log = true;
    console.log(`${req.session.id} - [${req.path}] - ${JSON.stringify(req.session)}`)

    next()
}