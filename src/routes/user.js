var express = require('express');
var router = express.Router();
const session = require('../lib/session.js')

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
