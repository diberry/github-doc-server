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

    const userProfile = Object.assign({}, session.get(req,"user"))
    delete userProfile.gitHubToken
    res.send(userProfile)
})

  module.exports = router
