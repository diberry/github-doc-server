const express = require('express');
const path = require('path')
const lib = require('github-doc-server-lib');

const session=require("../session");

let router = express.Router();

router.get('/', async (req, res) => {

    res.send('GitHub route')
})
router.get('/repos', async (req, res) => {

    const userSession = session.get(req,"user");
    const token = userSession.gitHubToken;
    const role = req.query["role"] || "owner";

    const userReposForRole = await lib.GitHub.Repo.getRepoListByUserRole(token, user.login,role)

    res.send(userReposForRole)

})
router.get('/readme', async (req, res) => {

    const userSession = session.get(req,"user");
    const token = userSession.gitHubToken;

    const repoInfo = {
        repo: req.query.repo,
        owner: req.query["owner"],
        path: "README.md"
    }

    const readmeForRepo = await lib.GitHub.File.readme(token, user.login,repoInfo)

    if(readmeForRepo && readmeForRepo.content) {
        res.send(JSON.stringify(readmeForRepo.content))
    } else {
        req.app.locals.log.trace(app.locals.appInsightsClient, "check query params", req.app.locals.ENVIRONMENT)
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

    const results = await lib.GitHub.File.readFile(token, user.login, repoInfo )

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

    const fileContents = await lib.GitHub.File.writeFile(token, repoInfo, fileInfo)

    res.send(JSON.stringify(fileContents))

});

router.get('/token', async (req, res, next) => {

    res.send(req.session.user.gitHubToken)

});

module.exports = router;