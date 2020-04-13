const http  = require('../http.js');

module.exports.getRepoListByUserRole = async (token,user,role) => {

    if(!token || !user || !role) return;

    const request = http.getAuthenticatedHttp(token);

    const response = await request({
        method: 'GET',
        url: `/users/${user}/repos?type=${role}`
      });

  return response.data;
}