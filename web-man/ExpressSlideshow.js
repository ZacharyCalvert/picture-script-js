const express = require('express')
const app = express();
var open = require("open");
var fs = require ('fs');
var EntryManager = require('../pic-man/EntryManager.js')

var pathToApp = __dirname;

var show = function(ids, managed) {

  this.entryManager = EntryManager.loadEntryManager(managed);
  var manager = this.entryManager;

  app.use(express.json());  

  app.get('/ids', function (req, res) { 
    res.status(200).send(ids);
  });

  app.get('/ids/:id', function(req, res) {
    res.send(manager.find(req.params.id));
  });

  app.use('/media', express.static(managed));

  app.use('/react', express.static(__dirname + '/public'))

  app.get('/', function(req, res) {
    res.sendFile(pathToApp + '/static/slideshow.html');
  });

  app.listen(3000, () => open("http://localhost:3000/"));
}

module.exports = show;