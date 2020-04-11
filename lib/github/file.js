const http = require('../http.js');
const axios = require('axios')
const Octokit = require("@octokit/rest");
const Base64 = require('js-base64').Base64;


const readme = async (token, user, repoInfo) => {

  if (!token || !user || !repoInfo) return;

  const request = http.getAuthenticatedHttp(token);

  const octokit = new Octokit.Octokit({
    auth: token
  });

  const config = {
    owner: "diberry",
    repo: "public-test",
    path: "README.md"
  }

  const contents = await octokit.repos.getContents(config);

  return (contents && contents.data) ? contents.data : null;
}

const readFile = async (token, user, repoInfo, fileInfo) => {

  if (!token || !user || !fileInfo || !repoInfo) return;
  const octokit = new Octokit.Octokit({
    auth: token
  });
  const id = Number(new Date()).toString()

  const config = {
    owner: "diberry",
    repo: "public-test",
    path: `README-${id}.md`,
    message: `commit message ${id}`,
    content: `content ${id}`,
    committer: {
      name: `Dina Berry`,
      email: `diberry@microsoft.com`
    },
    author: {
      name: `Dina Berry`,
      email: `diberry@microsoft.com`
    }
  }

  const contents = await octokit.repos.createOrUpdateFFile(config);
  return (contents && contents.data) ? contents.data : null;

}

const writeFile = async (token, user, repoInfo, fileInfo, environment) => {

  try {
    const request = http.getAuthenticatedHttp(token, environment)

    const id = Number(new Date()).toString()
    const owner = "diberry"
    const repo = "public-test"
    const path = `README-${id}.txt`
    const base64Content = Base64.encode(`content ${id}`);
    const uri = `diberry/public-test/contents/curl-test-${id}.txt`;

    const fullUri = `https://api.github.com/repos/diberry/public-test/contents/curl-test-${id}.txt`

    const data = {
      "message": "my commit message",
      "committer": {
        "name": "Dina Berry",
        "email": "diberry@microsoft.com"
      },
      "content": "aGVsbG8gd29ybGQ="
    }
/*
      proxy: {
        host: "127.0.0.1",
        port: "8888"
      },
*/
    const headers = {

      headers: {
        'Authorization': 'token ' + token,
        'Accept': '*/*',
        'User-Agent': 'curl/7.69.1',
        'Content-Type': 'application/json',
        'Host': 'api.github.com',
        'Cookie': '_octo=GH1.1.1279080220.1583979436; logged_in=no'
      }
    }

    const contents = await axios.put(fullUri, data, headers)
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