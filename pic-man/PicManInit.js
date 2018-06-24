
var fs = require ('fs')

module.exports = class PicManInit {

  constructor (folder) {
    this.folder = folder;
  }

  init() {
    if (fs.existsSync(this.folder)) {
      console.log("'%s' exists", this.folder);
    } else {
      console.log("'%s' does not exist");
    }
  }
}
