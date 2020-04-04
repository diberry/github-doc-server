const axios = require('axios')

module.exports.getAuthenticatedHttp = (token) => {

    return axios.create({
        baseURL: 'https://api.github.com',
        timeout: 1000,
        headers: {'Authorization': 'token ' + token}
      });
}