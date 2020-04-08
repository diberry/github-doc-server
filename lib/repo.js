const http  = require('./http.js');

module.exports.readFile = async (token) => {

    //if(!token || !fileName || !text) return;

    const request = http.getAuthenticatedHttp(token);

    const body = {
        "ref": "master"
      }

    const response = await request({
        method: 'GET',
        url: `/repos/diberry/private-test/contents/README.md`,
        body
      });

  console.log(response.data)
  return response.data;
}