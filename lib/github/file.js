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
    const base64Content = Base64.encode(`${new Date()} - content ${id}`);
    const uri = `diberry/public-test/contents/curl-test-${id}.txt`;

    const fullUri = `https://api.github.com/repos/diberry/public-test/contents/curl-test-${id}.txt`

    const data = {
      "message": "my commit message",
      "committer": {
        "name": "Dina Berry",
        "email": "diberry@microsoft.com"
      },
      "content": base64Content
    }

    const config = {
      headers: {
        'Authorization': 'token ' + token,
        'Accept': '*/*',
        'User-Agent': 'curl/7.69.1',
        'Content-Type': 'application/json'
      }
    }

    console.log(id)

    const contents = await axios.put(fullUri, data, config)
    return (contents && contents.data) ? contents.data : null;
  } catch (err) {
    console.log(err)
  }
}

const writeFile2 = async (token, user, repoInfo, fileInfo) => {

  try {
    const request = http.getAuthenticatedHttp(token, null)

    const id = Number(new Date()).toString()
    const owner = "diberry"
    const repo = "public-test"
    const path = `README-${id}.txt`
    const base64Content = Base64.encode(`${new Date()} - content ${id}`);
    const uri = `repos/diberry/public-test/contents/curl-test-${id}.txt`;
    const data = {
      "message": "my commit message",
      "committer": {
        "name": "Dina Berry",
        "email": "diberry@microsoft.com"
      },
      "content": base64Content
    }
    console.log(id)

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
  writeFile2,
  readFile,
  readme
};