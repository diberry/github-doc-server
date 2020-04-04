var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var indexRouter = require('./routes/index');
const user = require('./lib/user.js')
const gitHubAuthentication = require('./lib/githubAuth.js')
const CONFIG = require('./config.js')

var app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  credentials: true,
  origin: `http://localhost:${CONFIG.UI_PORT}`
}))


app.use('/', indexRouter);
app.get('/status', function (req, res, next) {
  res.send('API is working properly');
});
app.get('/login', (req, res, next) => {
  console.log('login called')
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CONFIG.GITHUB_CLIENT_ID}`);
})

// Declare the redirect route
app.get('/github/callback', async (req, res) => {

  console.log('/github/callback called')

  // The req.query object has the query params that were sent to this route.
  if(req && req.query && req.query.code){
    const code = req.query.code
    console.log(`code = ${code}`);

    const responseAccessToken = await gitHubAuthentication.getAuthenticatedHttp(CONFIG.GITHUB_CLIENT_ID, CONFIG.GITHUB_CLIENT_SECRET, code);

    const accessToken = responseAccessToken.data.access_token
    console.log(accessToken)

    const userProfile = await user.getProfile(accessToken)
    console.log(userProfile)
    res.send(JSON.stringify(userProfile))
    return
  }
  res.send('no code sent')


})
module.exports = app;
