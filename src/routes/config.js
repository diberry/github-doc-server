const express = require('express');
const CLIENT_CONFIG = require('../config.js').CLIENT_CONFIG;

let router = express.Router();

router.get('/', (req, res) => {

    res.json(CLIENT_CONFIG)
})

  module.exports = router