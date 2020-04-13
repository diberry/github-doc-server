


module.exports = (req, res, next) => {

    req.app.locals.appInsightsClient.trackNodeHttpRequest({req, res});

    req.session.log = true;
    console.log(`log-route - ${req.session.id} - [${req.path}] - ${JSON.stringify(req.session)}`)

    next()
}