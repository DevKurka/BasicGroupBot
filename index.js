var config = require("./config.json");
var cache = require("./cache.js");

var roblox = require("./roblox");

async function scan(methods) {
  if (runningScan == 1) return;
  runningScan = 1;

  var ban_role_id = await methods.getRoleById(config.group, config.ban_rank);
  if (ban_role_id == undefined) return;
  if (cache.cache.wall == undefined) cache.cache.wall = {};

  await methods.fetchNewWall(config.group, cache.cache.wall[config.group] || 0, 100).then(async function(data) {
    if (data == undefined) return;
    var alreadyBanned = {};
    if (data[0] != undefined) { cache.cache.wall[config.group] = data[0].id; }
    for (let i in data) {
      if (data[i] != undefined && data[i].body != undefined && data[i].poster != undefined) {
        let content = data[i].body.toUpperCase();
        let level = 0;
        for (let word of config.banned_words) {
          if (content.indexOf(word.toUpperCase()) != -1) {
            level++;
          }
        }
        if (level >= config.target_level && alreadyBanned[data[i].poster.user.userId] == undefined && data[i].poster.role.rank < config.op_ranks) {
          console.log(data[i].poster.user.username + " is being banned.");
          alreadyBanned[data[i].poster.user.userId] = 1;
          await methods.deleteUserPosts(config.group, data[i].poster.user.userId);
          await methods.setRank(config.group, data[i].poster.user.userId, ban_role_id.id);
          await methods.follow(data[i].poster.user.userId);
          await methods.sendMessage(data[i].poster.user.userId, config.ban_message.subject, config.ban_message.body);
        }
      }
    }
  });
  cache.save();
  runningScan = 0;
}

roblox(config.login_type, config.login, config.password).then(async function(methods) {
  console.log("Bot has been ran!");
  scan(methods);
  setInterval(function() { scan(methods); }, config.scan_delay);
});
