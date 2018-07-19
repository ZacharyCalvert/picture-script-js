const express = require('express')
const app = express();
var open = require("open");
var fs = require ('fs');
var EntryManager = require('../pic-man/EntryManager.js')

var pathToApp = __dirname;

var review = function(managed) {

  if (fs.existsSync(managed) && fs.existsSync(managed + "/pic-man.db")) {
    this.entryManager = new EntryManager(managed + "/pic-man.db");
  } else {
      console.log("Managed folder '%s' is not initialized", managed);
      throw managed + " folder is not initialized.";
  }

  var manager = this.entryManager;

  app.use(express.json());  

  app.get('/ids', function (req, res) { 
    res.send(manager.getShaSums());
  });

  app.get('/entry/tags', function(req, res) {
    res.send(manager.getTags());
  });

  app.get('/entry/tags/:id', function(req, res) {
    res.send(manager.getTags(req.params.id));
  });

  app.post('/entry/tags/:id', function(req, res) {
    manager.setTags(req.params.id, req.body);
    manager.save();
    res.sendStatus(204);
  });

  app.patch('/entry/:id', function(req, res) {
    if (req.body.reviewDone !== undefined) {
      manager.setReviewDone(req.params.id, req.body.reviewDone);
    }
    manager.save();
  });

  app.patch('/entry', function(req, res) {
    // todo
  });

  app.get('/ids/:id', function(req, res) {
    res.send(manager.find(req.params.id));
  });

  app.use('/media', express.static(managed));

  app.use('/review/react', express.static(__dirname + '/public'))
  app.get('/review', function(req, res) {
    res.sendFile(pathToApp + '/static/index.html');
  });

  app.listen(3000, () => open("http://localhost:3000/review"));
}

module.exports = review;