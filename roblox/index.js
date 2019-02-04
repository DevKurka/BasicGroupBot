var fs = require("fs");
var path = require("path");

/*
  OUTDATED DUE TO THE FUNCAPTCHA
  
var login = require("./includes/login.js");
module.exports = async function(type, username, password) {
  return await login(type, username, password).then(function(jar) {
    var methods = {};

    var modulesHolder = fs.readdirSync("./roblox/modules").filter(function(file) {
      return fs.statSync(path.join("./roblox/modules", file)).isDirectory();
    });
    for (let i = 0; i < modulesHolder.length; i++) {
      let moduleName = modulesHolder[i];
      let mod = require("./modules/" + moduleName);
      for (let f in mod) {
        methods[f] = async function(a, b, c, d, e) { return await mod[f](jar, a, b, c, d, e); };
      }
    }
    return methods;
  });
}
*/
var login = require("./includes/loginToken.js");

module.exports = async function(token) {
  return await login(token).then(function(jar) {
    var methods = {};

    var modulesHolder = fs.readdirSync("./roblox/modules").filter(function(file) {
      return fs.statSync(path.join("./roblox/modules", file)).isDirectory();
    });
    for (let i = 0; i < modulesHolder.length; i++) {
      let moduleName = modulesHolder[i];
      let mod = require("./modules/" + moduleName);
      for (let f in mod) {
        methods[f] = async function(a, b, c, d, e) { return await mod[f](jar, a, b, c, d, e); };
      }
    }
    return methods;
  });
}
