const express = require('express');
const path = require('path')
const lib = require('github-doc-server-lib');

const session=require("../session");

let router = express.Router();

const catchAsync = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };

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

    console.log(`/api/github/note GET top`)

    //const filePath =path.join(__dirname,'../public/note.html');
    //res.sendFile(filePath)
    res.redirect(`https://localhost:3000/note`);

});

router.post('/note', catchAsync(async (req, res, next) => {

    const user = session.get(req,"user");
    const token = user.gitHubToken;
    const DEFAULT_TIMEOUT = (60 * 1 * 100)

    if(!req
        || !req.body
        || !req.body.repo.owner
        || !req.body.repo.name
        || !req.body.repo.path
        || !req.body.commit.content
        || !req.body.commit.commitmessage
        || !req.body.commit.committername
        || !req.body.commit.committeremail) return res.status(404).statusMessage("Invalid request body")

        //const fileContents = await lib.GitHub.File.writeFile(token, req.body.repo, req.body.commit, DEFAULT_TIMEOUT)

        lib.GitHub.File.writeFile(token, req.body.repo, req.body.commit, DEFAULT_TIMEOUT)
        .then(results =>
            res.send(JSON.stringify(results))
        ).catch(err=>{
            next(err)
        })

        //res.send(JSON.stringify(fileContents))
        //next()
}));

router.get('/token', async (req, res, next) => {

    console.log(`/api/github/token top`)

    res.send(req.session.user.gitHubToken)

});

module.exports = router;