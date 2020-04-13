const axios = require('axios')

module.exports.getAuthenticatedToken = async (clientId, clientSecret, code) => {

    if(!code || !clientId || !clientSecret) return;

    return await axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
        headers: {
          accept: 'application/json'
        }

      });
}