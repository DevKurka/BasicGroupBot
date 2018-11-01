module.exports = function(data) {
  var param = "";
  for (let i in data) {
    let value = data[i];
    if (value != undefined) {
      if (param == "") {
        param += "?" + i + "=" + value;
      } else {
        param += "&" + i + "=" + value;
      }
    }
  }
  return param;
}
