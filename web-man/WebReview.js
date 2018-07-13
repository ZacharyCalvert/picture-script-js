const express = require('express')
const app = express();
var open = require("open");
var fs = require ('fs');
var EntryManager = require('../pic-man/EntryManager.js')

var review = function(managed) {

  if (fs.existsSync(managed) && fs.existsSync(managed + "/pic-man.db")) {
    this.entryManager = new EntryManager(managed + "/pic-man.db");
  } else {
      console.log("Managed folder '%s' is not initialized", managed);
      throw managed + " folder is not initialized.";
  }

  var manager = this.entryManager;

  app.get('/ids', function (req, res) { 
    res.send(manager.getShaSums());
  });

  app.get('/ids/:id', function(req, res) {
    res.send(manager.find(req.params.id));
  });

  app.use('/media', express.static(managed));

  app.listen(3000, () => open("http://localhost:3000/ids"));
}

module.exports = review;