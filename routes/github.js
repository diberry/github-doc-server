var express = require('express');
var router = express.Router();
const gitHubAuthentication = require('../lib/github/githubAuth.js')
const userUtils = require('../lib/github/user.js')
const path = require('path')
const session = require('../lib/session.js')
const repo = require('../lib/github/repo')
const file = require('../lib/github/file')

router.use(function timeLog (req, res, next) {
    console.log('Github route - Time: ', Date.now())
    next()
  })
router.get('/', async (req, res) => {

    res.send('found github route')
})
router.get('/repos', async (req, res) => {
    const CONFIG = req.app.locals;
    console.log('/github/repos [GET] called')

    const user = session.get(req,"user");
    const token = user.gitHubToken;

    const userReposForRole = await repo.getRepoListByUserRole(token, user.login,"owner")

    res.send(userReposForRole)

})
router.get('/readme', async (req, res) => {
    const CONFIG = req.app.locals;
    console.log('/github/readme [GET] called')

    const user = session.get(req,"user");
    const token = user.gitHubToken;
    const repoInfo = {
        name:"private-test",
        owner: "diberry",
        branch: "master"
    }

    const readmeForRepo = await file.readme(token, user.login,repoInfo)

    res.send(JSON.stringify(readmeForRepo.content))

})

router.get('/file', async (req, res) => {
    const CONFIG = req.app.locals;
    console.log('/github/file [GET] called')

    const user = session.get(req,"user");
    const token = user.gitHubToken;

    const userReposForRole = await file.readFile(token, user.login, {}, {} )

    res.send(JSON.stringify(readmeForRepo.content))

})
router.get('/filewrite', async (req, res) => {
    const CONFIG = req.app.locals;
    console.log('/github/file [GET] called')

    const user = session.get(req,"user");
    const token = user.gitHubToken;

    const writeFileResults = await file.writeFile(token, user.login, {}, {},  CONFIG.environment )

    res.send(JSON.stringify(writeFileResults.content))

})
router.get('/repos', async (req, res, next) => {

    const CONFIG = req.app.locals;
    console.log('/github/repos [GET] called')

    const token = user.gitHubToken;

    const fileContents = await repo.getRepoListByUserRole(token, user.login,"owner")

    res.send(JSON.stringify(filecontents))
});
router.get('/note', function (req, res, next) {

    const CONFIG = req.app.locals;
    console.log('/note [GET] called')

    const filePath =path.join(__dirname,'../public/note.html');
    res.sendFile(filePath)
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");

});


router.post('/note', async (req, res, next) => {

    const CONFIG = req.app.locals;
    console.log('/github/note [POST] called')

    const filecontents = req.body.filecontents || "hello world";
    const user = session.get(req,"user") || "diberry";
    const token = user.gitHubToken;

    const fileContents = await file.writeFile(token, user,{}, {})

    res.send(JSON.stringify(fileContents))

});

router.get('/token', async (req, res, next) => {

    const CONFIG = req.app.locals;
    console.log('/github/token [POST] called')

    res.send(session.get(req,"user").gitHubToken)

});

module.exports = router;