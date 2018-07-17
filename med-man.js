#!/usr/bin/env node

var program = require('commander');
var PicManInit = require('./pic-man/PicManInit.js')
var DirectoryImporter = require('./pic-man/DirectoryImporter.js')
var MigrateService = require('./pic-man/MigrateService.js')
var WebReview = require('./web-man/WebReview.js')
var loadEntryManager = require('./pic-man/EntryManager.js').loadEntryManager;


program
  .command('import <dir> <managed>')
  .option('-n, --nocopy', 'Index but do not copy')
  .option('-m, --move', 'Move media instead of copy it')
  .action(function(dir, managed, cmd) {
    DirectoryImporter(dir, managed, cmd);
  });

program.command('init <managed>')
  .action(function(managed, cmd) {
    new PicManInit(managed).init();
  });

program
  .command('migrate <dir> <managed>')
  .option('-n, --nocopy', 'Index but do not copy')
  .option('-m, --move', 'Move media instead of copy it')
  .action(function(dir, managed, cmd) {
    MigrateService(dir, managed, cmd);
  });  
  
program
  .command('review <managed>')
  .action(function(managed, cmd) {
    console.log("Reviewing managed at %s", managed);
    WebReview(managed);
  });

program
  .command('tag <managed> <folder> <tag>')
  .option('-i, --insensitive', 'Case insensitive operation')
  .action(function(managed, folder, tag, cmd) {
    var tagged = {count:0};
    var entryManager = loadEntryManager(managed);
    entryManager.addTagByFilter((entry) => {
      if (entry.paths) {
        for (const path of entry.paths) {
          if (cmd.insensitive) {
            if (path.toLowerCase().includes(folder.toLowerCase())) {
              tagged.count++;
              return true;
            }
          } else {
            if (path.includes(folder)) {
              tagged.count++;
              return true;
            }
          }
        }
      }
      return false;
    }, tag);
    entryManager.save();
    console.log("%d files tagged with %s", tagged.count, tag);
  });


program.parse(process.argv);
