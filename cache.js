var fs = require('fs');
var config = require("./config.json");

fs.readFile(config.cache_path, function(err, data) {
    if (err) throw err;
    module.exports.cache = JSON.parse(data);
});

module.exports.save = function() {
  fs.writeFileSync(config.cache_path, JSON.stringify(module.exports.cache));
}
