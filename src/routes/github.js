const express = require('express');
const path = require('path')
const session = require('../lib/session.js')
const repo = require('../lib/github/repo')
const file = require('../lib/github/file')

let router = express.Router();

router.get('/', async (req, res) => {

    res.send('GitHub route')
})
router.get('/repos', async (req, res) => {

    const user = session.get(req,"user");
    const token = user.gitHubToken;
    const role = req.query["role"] || "owner";

    const userReposForRole = await repo.getRepoListByUserRole(token, user.login,role)

    res.send(userReposForRole)

})
router.get('/readme', async (req, res) => {

    const user = session.get(req,"user");
    const token = user.gitHubToken;

    const repoInfo = {
        repo: req.query.repo,
        owner: req.query["owner"],
        path: "README.md"
    }

    const readmeForRepo = await file.readme(token, user.login,repoInfo)

    if(readmeForRepo && readmeForRepo.content) {
        res.send(JSON.stringify(readmeForRepo.content))
    } else {
        console.log("check query params")
    }



})

router.get('/file', async (req, res) => {

    const user = session.get(req,"user");
    const token = user.gitHubToken;

    const repoInfo = {
        repo: req.query.repo || req.form.repo,
        owner: req.query["owner"]  || req.form["repo-owner"],
        path: req.query.path  || req.form.path
    }

    const results = await file.readFile(token, user.login, repoInfo )

    res.send(JSON.stringify(results.content))

})
router.get('/note', function (req, res) {

    const filePath =path.join(__dirname,'../public/note.html');
    res.sendFile(filePath)

});

router.post('/note', async (req, res, next) => {

    const form = req.body;

    const user = session.get(req,"user");
    const token = user.gitHubToken;

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

    const fileContents = await file.writeFile(token, repoInfo, fileInfo)

    res.send(JSON.stringify(fileContents))

});

router.get('/token', async (req, res, next) => {

    res.send(req.session.user.gitHubToken)

});

module.exports = router;