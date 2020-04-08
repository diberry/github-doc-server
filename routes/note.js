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
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");

});

router.post('/', async (req, res, next) => {

    const CONFIG = req.app.locals;
    console.log('/note [POST] called')

    if (req.body && req.body.filecontents && req.body.filecontents.length>0) {

        const filecontents = req.body.filecontents

        //const fileContents = await repo.readFile(session.get(req, "gitHubUserAccessToken"))

        res.send(req.body.filecontents)
    }
});

module.exports = router;