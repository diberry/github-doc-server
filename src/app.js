const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const lib = require('github-doc-server-lib')
const session=require("./session")

const appInsights = require("applicationinsights");
const authentication = require('./routes/authentication')

// Config
const GLOBALCONFIG = require('./config.js').SERVER_CONFIG;

const Router = require('./routes/index');

console.log(Router);


// app config
let app = express();
app.locals = GLOBALCONFIG;

// remote logging
const appInsightsClient = appInsights.defaultClient;
app.locals.appInsightsClient = appInsightsClient;
app.locals.log = lib.Log;

// cookies and sessions
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  credentials: true,
  origin: `http://localhost:${GLOBALCONFIG.UI_PORT}`
}))
app.use(session.createSessionMiddleWare(GLOBALCONFIG.SESSION_SETTINGS))

app.use(express.static(path.join(__dirname, './public')));
app.use(Router.Routes.Meta.preroute)

// public routes
app.get('/api/error',(req, res) =>{
  req.app.locals.log.trace(req.app.locals.appInsightsClient, "app insights key is found", req.app.locals.ENVIRONMENT)
  throw new Error('false error');
})
app.get('/api/status', (req, res) => {
  res.send(JSON.stringify(req.session));
});
app.get('/api/login',authentication.login)
app.get('/api/logout',authentication.logout)
app.use('/api/client/config', Router.Routes.ClientConfig)


app.use('/api/callback', Router.Routes.Authentication)
app.use('/api/user', Router.isAuthenticated, Router.Routes.User);
app.use('/api/github', Router.isAuthenticated, Router.Routes.GitHub);

app.get('/error/sync', (req, res, next) =>{
  console.log(`variable is undefined ${notdefined}`)
  next()
})

const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

app.get('/error/async', catchAsync(async(req, res, next) =>{
  await Promise.reject('async error')
}))


function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
app.use(logErrors);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);
});


// catch all error handlers
app.use((err, req, res, next) => {

  //let errorStack = (app.get('env') === 'development') ? err : {};
  const errorStack = {
    url: req.url,
    api: req.path,
    method: req.method,
    error: {
      msg: err.message,
      stack: err.stack
  }};
  res.status(500).json(errorStack);

  next(err);
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke! ' + JSON.stringify(err))
});

process.on('uncaughtException', function (err) {
  console.log('-------------------------- Caught exception: ' + err);
});

module.exports = app;
