
var fs = require ('fs');
var writeFile = require('write');
var mkdirp = require('mkdirp');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

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
            var lowDbPath = folder + "/pic-man.db";
            writeFile.sync(lowDbPath, "");
            const adapter = new FileSync(lowDbPath);
            var mediaLowDb = low(adapter);
            mediaLowDb.defaults({ media: [], tags: []}).write();
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
