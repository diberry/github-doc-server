const http  = require('../http.js');

module.exports.getProfile = async (token) => {

    if(!token) return;

    const request = http.getAuthenticatedHttp(token);

    const userProfileResponse = await request({
        method: 'get',
        url: '/user'
      });

      return userProfileResponse.data;
}
