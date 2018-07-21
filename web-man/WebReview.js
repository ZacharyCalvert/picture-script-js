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
    res.send(manager.filterIds((entry) => !(entry.reviewDone === true)));
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

  app.delete('/entry/:id', function(req, res) {
    manager.deleteAndIgnore(req.params.id);
    manager.save();
    res.sendStatus(204);
  });

  app.patch('/entry/:id', function(req, res) {
    if (req.body.reviewDone !== undefined) {
      manager.setReviewDone(req.params.id, req.body.reviewDone);
      res.sendStatus(204);
    } else if (req.body.excludeFromExport !== undefined) {
      manager.setExcludFromExport(req.params.id, req.body.excludeFromExport);
      res.sendStatus(204);
    }
    manager.save();
  });

  app.patch('/entry', function(req, res) {
    if (req.body.folder && req.body.tag) {
      // TODO -> this operation should emit an event and we should have 
      // reactive websocket event presentation of changes to the currently viewed
      // entry
      var stats = manager.tagFolder(req.body.folder, req.body.tag);
      console.log("Tagging folder %s with tag %s had %d matches", req.body.folder, req.body.tag, stats.tagsApplied);
      res.status(200).send(stats);
    } else if (req.body.folder && req.body.excludeFromExport !== undefined) { 
      var stats = {count: 0};
      var folder = req.body.folder;
      var filter = (entry) => {
        if (entry.paths) {
          for (const path of entry.paths) {
            var pathSplit = path.split('/');
            pathSplit.pop();
            for (var directory = pathSplit.pop(); directory; directory = pathSplit.pop()) {
              if (directory === folder) {
                return true;
              }
            }
          }
        }
        return false;
      };

      for (var id of manager.filterIds(filter)) {
        manager.setExcludFromExport(id, req.body.excludeFromExport);
        stats.count++;
      }
      res.status(200).send(stats);
    } else {
      res.sendStatus(400);
    }
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