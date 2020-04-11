const axios = require('axios')

module.exports.getAuthenticatedHttp = (token, environment) => {

    let config = {
      baseURL: 'https://api.github.com',
      timeout: 1000,
      headers: {
        'Authorization': 'token ' + token,
        'Accept': '*/*',
        'User-Agent':'curl/7.69.1',
        'Content-Type': 'application/json'
      }
    }


    return axios.create(config);
}