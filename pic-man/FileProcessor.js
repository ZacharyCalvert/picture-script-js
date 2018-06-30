
var sha256File = require('sha256-file');

module.exports = function (file, managed) {
    console.log("Wil run sha of %s", file)
    var sha256Sum = sha256File(file);
    console.log("%s sums to %s", file, sha256Sum);
};