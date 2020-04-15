const path = require('path');
const preroute = (req, res, next) => {

    if(req && req.app && req.app.locals && req.app.locals.appInsightsClient){
        req.app.locals.appInsightsClient.trackNodeHttpRequest({req, res});
    }

    req.session.log = true;
    req.app.locals.log.trace(req.app.locals.appInsightsClient, `preroute - ${req.session.id} - [${req.path}] - ${JSON.stringify(req.session)}`, req.app.locals.ENVIRONMENT)

    next()
}

const errorHandling  =  ((err, req, res, next) => {

  req.app.locals.log.error(req.app.locals.appInsightsClient, `postroute error - ${err}`, req.app.locals.ENVIRONMENT)

    if (res.headersSent) {
      return next(err)
    }
    res.status(500)

    const filePath =path.join(__dirname,'../public/error.html');
    res.sendFile(filePath)
  })

  module.exports = {
    preroute,
    errorHandling
  }