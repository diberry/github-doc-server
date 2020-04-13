const express = require('express');
const session = require('../lib/session.js')

let router = express.Router();

router.get('/', async (req, res) => {

    const userProfile = Object.assign({}, session.get(req,"user"))

    // don't return token to client
    delete userProfile.gitHubToken
    
    res.send(userProfile)
})

  module.exports = router
