var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

// Config
const GLOBALCONFIG = require('../src/config.js')

const preroute = require('./routes/preroute');
const user = require('./routes/user')
const authenticationRouter = require('./routes/authentication')
const gitHubRouter = require('./routes/github');

// app config
var app = express();
app.locals = GLOBALCONFIG;
app.use(logger('dev'));

// cookies and sessions
app.use(cookieParser());
const session = require(`../src/lib/session.js`)


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  credentials: true,
  origin: `http://localhost:${GLOBALCONFIG.UI_PORT}`
}))
app.use(session.createSessionMiddleWare(GLOBALCONFIG.SESSION_SETTINGS))
app.use(express.static(path.join(__dirname, './public')));
app.use(preroute)

// public routes
app.get('/status', (req, res) => {
  res.send(JSON.stringify(req.session));
});
app.get('/login', (req, res, next) => {
  const CONFIG = req.app.locals;
  console.log('login called')
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CONFIG.GITHUB_CLIENT_ID}&scope=user%20repo`);
})
app.use('/callback', authenticationRouter.router)

// authenticated routes
app.use('/github', authenticationRouter.isAuthenticated, gitHubRouter);
app.use('/user', authenticationRouter.isAuthenticated, user);

module.exports = app;
