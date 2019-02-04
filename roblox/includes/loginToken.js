var request = require('request-promise');
var http = require('./http.js');

module.exports = async function(token) {
  var jar = request.jar();

  jar.session = token;
  return jar;
}
