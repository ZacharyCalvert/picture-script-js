var fs = require ('fs');
var yaml = require('js-yaml');
var EntryManager = require('./EntryManager.js')
var DirectoryImporter = require('./DirectoryImporter.js')
var onExit = require('on-exit');

/*
// old format from my spring boot 

"processedFiles": [{
		"sha256": "252f2d6c07ae83bcd39c055288044b7624416a835c7f3856042051d80f35e5b8",
		"relativePath": "/photos/2011/05/103D7000/DSC_0891.JPG",
		"dateCreated": 1304879478000,
		"earliestKnownDate": 1304879478000,
		"extension": "jpg",
		"originalFileName": "/Volumes/Backup_2TB-Alpha/ToProcess7/Zach/2011/Anti-TSA Rally 6-5-2011/103D7000/DSC_0891.JPG"
	},
*/

function MigrateService(directory, managed, cmd)  {

  if (fs.existsSync(managed) && fs.existsSync(managed + "/pic-man.db")) {
    this.entryManager = new EntryManager(managed + "/pic-man.db");
  } else {
    console.log("Managed folder '%s' is not initialized", managed);
    throw managed + " is not a media managed folder";
  }

  var exitFunction = function () {
    this.entryManager.save();
  }
  exitFunction = exitFunction.bind(this);
  onExit(exitFunction);

  var stateFile = directory + "/.ps_state";
  if (fs.existsSync(directory) && fs.existsSync(stateFile)) {
    var doc = JSON.parse(fs.readFileSync(directory + "/.ps_state", 'utf8'));
    for (var entry of doc.processedFiles) {
      migrateEntry(entry);
    }
  } else {
    console.log("Migration folder expected file %s", stateFile);
    return;
  }

  DirectoryImporter(directory, managed, cmd);

  function migrateEntry(old) {
    var found = this.entryManager.addOrCreateEntry(old.sha256);
    this.entryManager.addExtension(found, old.extension);
    this.entryManager.addPath(found, old.originalFileName);
    this.entryManager.updateEarliestDate(found, [old.earliestKnownDate, old.dateCreated]);
  }
}

module.exports = MigrateService;