const path = require('path');
const preroute = (req, res, next) => {

    if(req && req.app && req.app.locals && req.app.locals.appInsightsClient){
        req.app.locals.appInsightsClient.trackNodeHttpRequest({req, res});
    }

    req.session.log = true;
    console.log(`preroute - ${req.session.id} - [${req.path}] - ${JSON.stringify(req.session)}`)

    next()
}

const errorHandling  =  ((err, req, res, next) => {

    console.log(`ErrorHandling ${err}`)

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