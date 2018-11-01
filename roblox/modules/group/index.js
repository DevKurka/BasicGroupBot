var http = require('./../../includes/http.js');
var param = require("./../../includes/param.js");

module.exports.getWall = async function(jar, group_id, page_id, sort, limit) {
  var curCursor = undefined;
  for (let i = 0; i < page_id; i++) {
    let res = await http('https://groups.roblox.com/v2/groups/' + group_id + '/wall/posts' + param({sortOrder: sort, limit: limit, cursor: curCursor}), jar, {
      method: 'GET'
    });

    var body = JSON.parse(res.body);
    if (body.data != undefined) {
      if (i == page_id - 1) return body.data;
      if (body.nextPageCursor == undefined) throw new Error("Couldn't find the page!");
      curCursor = body.nextPageCursor;
    } else {
      throw new Error("Couldn't fetch the posts.");
    }
  }
}

module.exports.fetchNewWall = async function(jar, group_id, last_id) {
  var posts = [];
  var curCursor = undefined;
  var page = 0;

  while (true) {
    page++; console.log("Scanning page " + page);
    let res = await http('https://groups.roblox.com/v2/groups/' + group_id + '/wall/posts' + param({sortOrder: "Desc", limit: 100, cursor: curCursor}), jar, {
      method: 'GET'
    });

    var body = JSON.parse(res.body);
    if (body.data != undefined) {
      for (let i of body.data) {
        if (i.id <= last_id) { return posts; }
        posts.push(i);
      }
      if (body.nextPageCursor == undefined) { return posts; }
      curCursor = body.nextPageCursor;
    } else {
      throw new Error("Couldn't fetch the posts.");
    }
  }
}
module.exports.deleteUserPost = async function(jar, group_id, post_id) {
  let res = await http('https://groups.roblox.com/v1/groups/' + group_id + '/wall/posts/' + post_id, jar, {
    method: 'DELETE'
  });
  return res.statusCode == 200;
}
module.exports.deleteUserPosts = async function(jar, group_id, user_id) {
  let res = await http('https://groups.roblox.com/v1/groups/' + group_id + '/wall/users/' + user_id + '/posts', jar, {
    method: 'DELETE'
  });
  return res.statusCode == 200;
}
module.exports.kickUser = async function(jar, group_id, user_id) {
  let res = await http('https://groups.roblox.com/v1/groups/' + group_id + '/users/' + user_id, jar, {
    method: 'DELETE'
  });
  return res.statusCode == 200;
}
module.exports.setRank = async function(jar, group_id, user_id, rank_id) {
  let res = await http('https://www.roblox.com/groups/api/change-member-rank?groupId=' + group_id + '&newRoleSetId=' + rank_id + '&targetUserId=' + user_id, jar, {
    method: 'POST'
  }, true);
  return res.statusCode == 200 && JSON.parse(res.body).success;
}
