const axios = require('axios')

module.exports.getAuthenticatedHttp = (token, environment) => {

    let config = {
      baseURL: 'https://api.github.com/',
      timeout: 1000,
      headers: {
        'Authorization': 'token ' + token,
        'Accept': '*/*',
        'User-Agent':'dfberry-oauth-app',
        'Content-Type': 'application/json'
      }
    }


    return axios.create(config);
}