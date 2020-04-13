module.exports = (req, res, next) => {

    if(req && req.app && req.app.locals && req.app.locals.appInsightsClient){
        req.app.locals.appInsightsClient.trackNodeHttpRequest({req, res});
    }

    req.session.log = true;
    console.log(`preroute - ${req.session.id} - [${req.path}] - ${JSON.stringify(req.session)}`)

    next()
}