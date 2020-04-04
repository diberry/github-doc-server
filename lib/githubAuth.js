const axios = require('axios')

module.exports.getAuthenticatedHttp = async (clientId, clientSecret, code) => {

    if(!code || !clientId || !clientSecret) return;

    return await axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
        // Set the content type header, so that we get the response in JSON
        headers: {
          accept: 'application/json'
        }

      });
}