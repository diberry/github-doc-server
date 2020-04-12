var express = require('express');
var router = express.Router();
const gitHubAuthentication = require('../lib/github/githubAuth.js')
const userUtils = require('../lib/github/user.js')
const path = require('path')
const session = require('../lib/session.js')
const repo = require('../lib/github/repo')
const file = require('../lib/github/file')
router.use(function timeLog (req, res, next) {
  console.log('authCallback route - Time: ', Date.now())
  next()
})
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

  module.exports = router
