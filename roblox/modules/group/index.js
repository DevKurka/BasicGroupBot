var http = require('./../../includes/http.js');
var param = require("./../../includes/param.js");

module.exports.getRoles = async function(jar, group_id) {
  let res = await http('https://groups.roblox.com/v1/groups/' + group_id + '/roles', jar, {
    method: 'GET'
  }, true);
  if (res == undefined) return;

  return res.statusCode == 200 && JSON.parse(res.body).roles;
}

module.exports.getRoleById = async function(jar, group_id, rank_id) {
  let roles = await module.exports.getRoles(jar, group_id);
  if (roles == undefined) return;

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].rank == rank_id) return roles[i];
  }

  return undefined;
}

module.exports.getWall = async function(jar, group_id, page_id, sort, limit) {
  var curCursor = undefined;
  for (let i = 0; i < page_id; i++) {
    let res = await http('https://groups.roblox.com/v2/groups/' + group_id + '/wall/posts' + param({sortOrder: sort, limit: limit, cursor: curCursor}), jar, {
      method: 'GET'
    });
    if (res == undefined) return;

    var body = JSON.parse(res.body);
    if (body.data != undefined) {
      if (i == page_id - 1) return body.data;
      if (body.nextPageCursor == undefined) return undefined;
      curCursor = body.nextPageCursor;
    } else {
      return undefined;
    }
  }
}

module.exports.fetchNewWall = async function(jar, group_id, last_id) {
  var posts = [];
  var curCursor = undefined;
  var page = 0;

  while (true) {
    page++;
    let res = await http('https://groups.roblox.com/v2/groups/' + group_id + '/wall/posts' + param({sortOrder: "Desc", limit: 100, cursor: curCursor}), jar, {
      method: 'GET'
    });
    if (res == undefined) return;

    var body = JSON.parse(res.body);
    if (body.data != undefined) {
      for (let i of body.data) {
        if (i.id <= last_id) { return posts; }
        posts.push(i);
      }
      if (body.nextPageCursor == undefined) { return posts; }
      curCursor = body.nextPageCursor;
    } else {
      return undefined;
    }
  }
}
module.exports.deleteUserPost = async function(jar, group_id, post_id) {
  let res = await http('https://groups.roblox.com/v1/groups/' + group_id + '/wall/posts/' + post_id, jar, {
    method: 'DELETE'
  });
  if (res == undefined) return;
  return res.statusCode == 200;
}
module.exports.deleteUserPosts = async function(jar, group_id, user_id) {
  let res = await http('https://groups.roblox.com/v1/groups/' + group_id + '/wall/users/' + user_id + '/posts', jar, {
    method: 'DELETE'
  });
  if (res == undefined) return;
  return res.statusCode == 200;
}
module.exports.kickUser = async function(jar, group_id, user_id) {
  let res = await http('https://groups.roblox.com/v1/groups/' + group_id + '/users/' + user_id, jar, {
    method: 'DELETE'
  });
  if (res == undefined) return;
  return res.statusCode == 200;
}
module.exports.setRank = async function(jar, group_id, user_id, rank_id) {
  let res = await http('https://www.roblox.com/groups/api/change-member-rank?groupId=' + group_id + '&newRoleSetId=' + rank_id + '&targetUserId=' + user_id, jar, {
    method: 'POST'
  }, true);
  if (res == undefined) return;
  return res.statusCode == 200 && JSON.parse(res.body).success;
}
