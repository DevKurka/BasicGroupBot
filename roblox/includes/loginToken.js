var request = require('request-promise');
var http = require('./http.js');

module.exports = async function(type, token) {
  var jar = request.jar();

  jar.session = token;
  return jar;
}
