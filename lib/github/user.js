const http  = require('../http.js');
//const axios = require('axios')

module.exports.getProfile = async (token) => {

    if(!token) return;

    const request = http.getAuthenticatedHttp(token);

    const userProfileResponse = await request({
        method: 'get',
        url: '/user'
      });

      console.log(userProfileResponse.data)
      return userProfileResponse.data;
}
