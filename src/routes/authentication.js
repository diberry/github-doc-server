var express = require('express');
var router = express.Router();
const gitHubAuthentication = require('../lib/github/githubAuth.js')
const userUtils = require('../lib/github/user.js')
const session = require('../lib/session.js')

router.get('/', async (req, res) => {

    const CONFIG = req.app.locals;
    console.log('callback called')

    // The req.query object has the query params that were sent to this route.
    if (req && req.query && req.query.code) {
        const code = req.query.code
        console.log(`code = ${code}`);

        const responseAccessToken = await gitHubAuthentication.getAuthenticatedHttp(CONFIG.GITHUB_CLIENT_ID, CONFIG.GITHUB_CLIENT_SECRET, code);

        const gitHubToken = responseAccessToken.data.access_token;
        console.log(gitHubToken)

        const userProfile = await userUtils.getProfile(gitHubToken)
        console.log(userProfile)

        const user = { ...userProfile, gitHubToken}
        session.set(req, "user", user);

        req.session.save(function(err) {
            if(err) {
              res.end('session save error: ' + err)
              return
            }
            res.send(JSON.stringify(user));
          })

    } else {
        console.log("/github/callback - code is empty ")
        res.send('/github/callback - code is empty ')
    }
  })



  const isAuthenticated = (req, res, next) => {

    const user = session.get(req, "user")
    if (req &&
        req.session &&
        req.session.user &&
        req.session.user.gitHubToken &&
        req.session.user.gitHubToken.length > 0)
        return next();

        res.redirect('/login');
}

module.exports = {
  router,
  isAuthenticated
}
