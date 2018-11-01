var config = require("./config.json");
var cache = require("./cache.js");

var roblox = require("./roblox");

async function scan(methods) {
  methods.fetchNewWall(config.group, cache.cache.wall_posts_scanned[config.group] || 0, 100).then(async function(data) {
    if (data[0] != undefined) { cache.cache.wall_posts_scanned[config.group] = data[0].id; cache.save(); }
    for (let i in data) {
      if (data[i] != undefined && data[i].body != undefined && data[i].poster != undefined) {
        let content = data[i].body.toUpperCase();
        let level = 0;
        for (let word of config.banned_words) {
          if (content.indexOf(word.toUpperCase()) != -1) {
            level++;
          }
        }
        if (level >= config.target_level && data[i].poster.role.rank < config.op_ranks) {
          console.log(data[i].poster.user.username + " has been banned.");
          await methods.deleteUserPosts(config.group, data[i].poster.user.userId);
          await methods.setRank(config.group, data[i].poster.user.userId, config.ban_role_id);
        }
      }
    }
  });
}


roblox(config.login_type, config.login, config.password).then(function(methods) {
  scan(methods);
  setInterval(function() { scan(methods); }, config.scan_delay);
});
