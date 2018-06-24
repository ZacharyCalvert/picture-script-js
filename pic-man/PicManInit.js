
var fs = require ('fs');
var writeFile = require('write');
var mkdirp = require('mkdirp');

module.exports = class PicManInit {

  constructor (folder) {
    this.folder = folder;
  }

  init() {
    var folder = this.folder;
    if (fs.existsSync(folder)) {
      fs.readdir(folder, function(err, files) {
        if (err) {
           console.error("Error occurred during reading of '%s'", folder, err)
        } else {
           if (files.length > 0) {
              console.error("%s is not empty and has not been initialized for media management.", folder)
           } else {
            writeFile.sync(folder + "/pic-man.db", "");
           }
        }
      });
    } else {
      mkdirp(folder, function (err) {
        if (err) console.error(err)
        else writeFile.sync(folder + "/pic-man.db", "");
      });
    }
  }
}
