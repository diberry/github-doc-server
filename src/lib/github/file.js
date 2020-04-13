const http = require('../http.js');
const axios = require('axios')
const Octokit = require("@octokit/rest");
const Base64 = require('js-base64').Base64;


const readme = async (token, user, repoInfo) => {

  if (!token || !user || !repoInfo) return;

  const octokit = new Octokit.Octokit({
    auth: token
  });

  const config = {
    owner: repoInfo.owner,
    repo: repoInfo.repo,
    path: repoInfo.path
  }
  const contents = await octokit.repos.getContents(config);

  return (contents && contents.data) ? contents.data : null;
}

const readFile = async (token, user, repoInfo, fileInfo) => {

  if (!token || !user || !repoInfo) return;

  const octokit = new Octokit.Octokit({
    auth: token
  });

  const config = {
    owner: repoInfo.owner,
    repo: repoInfo.repo,
    path: repoInfo.path
  }
  const contents = await octokit.repos.getContents(config);

  console.log(JSON.stringify(contents))

  return (contents && contents.data) ? contents.data : null;

}

const writeFile = async (token,  repoInfo, fileInfo) => {

  try {
    const request = http.getAuthenticatedHttp(token, null)

    const base64Content = Base64.encode(fileInfo.content);

    const restURI = "repos";

    const uri = `${restURI}/${repoInfo.owner}/${repoInfo.repo}/contents/${repoInfo.path}`;

    const data = {
      "message": "commmit message " + fileInfo.commitMessage,
      "committer": {
        "name": fileInfo.committerName,
        "email": fileInfo.committerEmail
      },
      "content": base64Content
    }

    const contents = await request({
      method: 'put',
      url: uri,
      data
    });

    return (contents && contents.data) ? contents.data : null;
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  writeFile,
  readFile,
  readme
};