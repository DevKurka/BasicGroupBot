var config = require("./config.json");

var roblox = require("./roblox");

roblox(config.login_type, config.login, config.password).then(function(methods) {
  methods.getWall(config.group, 1, "Desc").then(function(data) {
    console.log(data);
  });
});
