var express = require('express');
var router = express.Router();
const gitHubAuthentication = require('../lib/githubAuth.js')
const userUtils = require('../lib/user.js')
const path = require('path')
const session = require('../lib/session.js')

const isAuthenticated = (req, res, next) => {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    const user = session.get(req, "user")
    if (user)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE

    res.redirect('/');
  }

// Declare the redirect route
router.get('/callback', async (req, res) => {

    const CONFIG = req.app.locals;
    console.log('/github/callback called')

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
        await req.session.set(req, "user", user);
        await req.session.set(req, "token", gitHubToken);
        req.session["dog"]++
        res.redirect("/session-authenticated")
        res.end()

    } else {
        console.log("/github/callback - code is empty ")
        res.send('/github/callback - code is empty ')
        res.end
    }
})

module.exports = {
    router,
    isAuthenticated
};