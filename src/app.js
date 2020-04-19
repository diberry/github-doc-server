const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const lib = require('github-doc-server-lib')
const session=require("./session")

const appInsights = require("applicationinsights");

// Config
const GLOBALCONFIG = require('./config.js')

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
app.get('/api/login', (req, res, next) => {
  const CONFIG = req.app.locals;

  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CONFIG.GITHUB_CLIENT_ID}&scope=user%20repo`);
})
app.use('/api/callback', Router.Routes.Authentication)
app.use('/api/user', Router.isAuthenticated, Router.Routes.User);
app.use('/api/github', Router.isAuthenticated, Router.Routes.GitHub);


app.use(Router.Routes.Meta.errorHandling)
module.exports = app;
