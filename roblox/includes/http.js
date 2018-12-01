var request = require('request-promise');

request = request.defaults({
  forever: true,
  agentOptions: {
    maxSockets: Infinity
  },
  simple: false,
  gzip: true
});

async function send(url, jar, options) {
  if (options != undefined && jar != undefined) {
    if (options.headers == undefined) options.headers = {};
    options.headers.cookie = '.ROBLOSECURITY=' + jar.session + ';';
  }
  options.resolveWithFullResponse = true;
  return request(url, options);
}

module.exports = async function(url, jar, options, depth) {
  var depth = (depth != undefined) ? (depth + 1) : 1;

  if (depth > 3) {
    return undefined;
  }

  return await send(url, jar, options).then(async function(res) {
    if (res != undefined) {
      if (options != undefined && options.headers != undefined) {
        if (res.statusCode == 403 && (res.statusMessage == "Token Validation Failed" || res.statusMessage == 'XSRF Token Validation Failed')) {
          var newToken = res.headers['x-csrf-token'];
          if (newToken != undefined) {
            if (options.headers == undefined) options.headers = {};
            options.headers['X-CSRF-TOKEN'] = newToken;
            options.jar = jar;
            return await module.exports(url, jar, options, depth);
          } else {
            return undefined;
          }
        }
      }
      return res;
    }
    return undefined;
  })
};
