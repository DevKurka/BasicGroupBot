var http = require('./../../includes/http.js');
var param = require("./../../includes/param.js");

module.exports.follow = async function(jar, user_id) {
  let res = await http('https://api.roblox.com/user/follow', jar, {
    method: 'POST',
    json: {
      followedUserId: user_id
    }
  });
  if (res == undefined) return;

  return res.statusCode == 200;
}

module.exports.sendMessage = async function(jar, recipient, subject, body) {
  let res = await http('https://www.roblox.com/messages/send', jar, {
    method: 'POST',
    json: {
      recipientid: recipient,
      subject: subject,
      body: body
    }
  });
  if (res == undefined) return;

  return res.statusCode == 200 && res.body.success;
}
