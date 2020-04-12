var express = require('express');
var router = express.Router();
const gitHubAuthentication = require('../lib/github/githubAuth.js')
const userUtils = require('../lib/github/user.js')
const path = require('path')
const session = require('../lib/session.js')
const repo = require('../lib/github/repo')
const file = require('../lib/github/file')
const objects = require('../lib/objects')

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


router.post('/repo/commit', async (req, res, next) => {

    const CONFIG = req.app.locals;
    console.log('/github/note [POST] called')

    const form = req.body;

    console.log(JSON.stringify(form))

    const jsonToArray = objects.jsonToArray(form);

    const valid = jsonToArray.filter(item => {
        return (!(item.length >0))
    })

    const user = session.get(req,"user") || "diberry";

    const repoInfo = {
        owner: form.repoowner.trim(),
        repo: form.reponame.trim(),
        path: form.filename.trim()
    };

    const fileInfo = {
        content: form.filecontent.trim(),
        commitMessage: form.commitMessage.trim(),
        committerName:form.committername.trim(),
        committerEmail:form.committeremail.trim()
    }

    const token = user.gitHubToken;

    const fileContents = await file.writeFile(token, repoInfo, fileInfo)

    res.send(JSON.stringify(fileContents))

});

router.get('/token', async (req, res, next) => {

    res.send(req.session.user.gitHubToken)

});

module.exports = router;