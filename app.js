var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors')

// Config
const GLOBALCONFIG = require('./config.js')
console.log(JSON.stringify(GLOBALCONFIG));
const loggingMiddleware = require('./routes/log-route');
const gitHubRouter = require('./routes/github');
const authenticationRouter = require('./routes/authCallback')
const isAuthenticated = require('./routes/isAuthenticated')
const user = require('./routes/user')

// app config
var app = express();
app.locals = GLOBALCONFIG;
app.use(logger('dev'));

// cookies and sessions
app.use(cookieParser());
const session = require(`./lib/session.js`)


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  credentials: true,
  origin: `http://localhost:${GLOBALCONFIG.UI_PORT}`
}))
app.use(session.createSessionMiddleWare(GLOBALCONFIG.SESSION_SETTINGS))
app.use(express.static(path.join(__dirname, 'public')));
app.use(loggingMiddleware)

// routes
app.use('/callback', authenticationRouter)

app.use('/secure', isAuthenticated,  (req, res, next) =>{
  res.redirect('/session');
})
app.use('/github', isAuthenticated, gitHubRouter);
app.use('/user', isAuthenticated, user);


app.get('/status', (req, res) => {

  console.log(JSON.stringify(req.session));
  const newDate = new Date()

  if (!req.session.complex){
    const newSessionValue = {
      a: "blue",
      b: {
        view: 0,
        d: newDate}};

    session.set(req, "complex", newSessionValue);
  } else {

    let complex = session.get(req,"complex")
    complex.b.view++;
    complex.a = complex.a==="blue"  ? "red" :"blue";complex.b.d = newDate;

    session.set(req, "complex", complex);
  }

  res.send(`${JSON.stringify(req.session)}`);

});
app.get('/status2', (req, res) => {


  console.log(JSON.stringify(req.session));
  res.send(`${JSON.stringify(req.session)}`);
  res.end;
});
app.get('/login', (req, res, next) => {
  const CONFIG = req.app.locals;
  console.log('login called')
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CONFIG.GITHUB_CLIENT_ID}&scope=user%20repo`);
})
app.get('/session', (req,res,next)=> {
  if(req.session.views){
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('Views ' + req.session.views + "<br>")
    res.write('Expires in ' + (req.session.cookie.maxAge / 1000 )  + + "<br>")
    res.write(JSON.stringify(req.session))
    res.end()

  } else {
    req.session.views = 1
    res.end('views = 1 - refresh page' + JSON.stringify(req.session))
  }
});

module.exports = app;
