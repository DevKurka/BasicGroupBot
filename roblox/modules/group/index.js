var http = require('./../../includes/http.js');
var param = require("./../../includes/param.js");

module.exports.getWall = async function(jar, group_id, page_id, sort, limit) {
  var curCursor = undefined;
  for (let i = 0; i < page_id; i++) {
    let res = await http('https://groups.roblox.com/v2/groups/' + group_id + '/wall/posts' + param({sortOrder: sort, limit: limit, cursor: curCursor}), jar, {
      method: 'GET'
    });

    var body = JSON.parse(res.body);

    if (i == page_id - 1) return body.data;
    curCursor = body.nextPageCursor;
  }
}
