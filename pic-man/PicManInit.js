var fs = require ('fs');
var mkdirp = require('mkdirp');
var EntryManager = require('./EntryManager.js')

function PicManInit(folder) {
  this.folder = folder;
}

PicManInit.prototype.init = function() {
  
  function initDb(path) {
    EntryManager.initDb(path);
  }

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
          initDb(lowDbPath);
         }
      }
    });
  } else {
    mkdirp(folder, function (err) {
      if (err) { console.error(err) 
      } else {
        initDb(folder + "/pic-man.db");
      }
    });
  }
}

module.exports = PicManInit;