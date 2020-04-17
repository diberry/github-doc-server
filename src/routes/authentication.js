const express = require('express');
const lib = require('github-doc-server-lib');
let router = express.Router();
const session = require('../session')

router.get('/', async (req, res, next) => {

    const CONFIG = req.app.locals;

    if (req && req.query && req.query.code) {
        const code = req.query.code

        const responseAccessToken = await lib.GitHub.Authentication.getAuthenticatedToken(CONFIG.GITHUB_CLIENT_ID, CONFIG.GITHUB_CLIENT_SECRET, code);

        const gitHubToken = responseAccessToken.data.access_token;

        const userProfile = await lib.GitHub.User.getProfile(gitHubToken)
        const userObject = { ...userProfile, gitHubToken}
        session.set(req, "user", userObject);

        req.session.save(function(err) {
            if(err) {
              res.end('session save error: ' + err)
              return
            }
            res.send(JSON.stringify(userObject));
          })

    } else {
        req.app.locals.log.trace(app.locals.appInsightsClient, "/github/callback - code is empty", req.app.locals.ENVIRONMENT)
        res.send('/github/callback - code is empty ')
    }
  })



  const isAuthenticated = (req, res, next) => {

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
