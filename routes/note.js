var express = require('express');
var router = express.Router();
const path = require('path')
const repo = require('../lib/repo');
const session = require('../lib/session.js')

router.get('/', function (req, res, next) {

    const CONFIG = req.app.locals;
    console.log('/note [GET] called')

    const filePath =path.join(__dirname,'../public/note.html');
    res.sendFile(filePath)
});

router.post('/', async (req, res, next) => {

    const CONFIG = req.app.locals;
    console.log('/note [POST] called')

    if (req.body) {

        const fileContents = await repo.readFile(session.get(req, "gitHubUserAccessToken"))

        res.send(`note received - req.body - ${JSON.stringify(fileContents)}`);
    }
});

module.exports = router;