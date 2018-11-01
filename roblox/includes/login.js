var request = require('request-promise');
var http = require('./http.js');

module.exports = async function(type, username, password) {
  var jar = request.jar();

  return await http('https://auth.roblox.com/v2/login', jar, {
    method: 'POST',
    json: {
      'ctype': type,
      'cvalue': username,
      'password': password
    }
  }).then(function(res) {
    var json = res.body;
    if (res.body.twoStepVerificationData != undefined) {
      throw new Error("Can't support two step verification!");
    }

    if (res.statusCode == 200) {
      var cookies = res.headers['set-cookie'];
      if (cookies != undefined) {
        var session = cookies.toString().match(/\.ROBLOSECURITY=(.*?);/)[1];
        jar.session = session;
        return jar;
      }
    } else {
      if (json.errors != undefined && json.errors[0] != undefined) {
        throw new Error(json.errors[0].message);
      }
    }
  });
}
