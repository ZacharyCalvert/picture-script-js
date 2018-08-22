#!/usr/bin/env node

var program = require('commander');
var PicManInit = require('./pic-man/PicManInit.js')
var DirectoryImporter = require('./pic-man/DirectoryImporter.js')
var Check = require('./pic-man/CheckEntry.js')
var MigrateService = require('./pic-man/MigrateService.js')
var WebReview = require('./web-man/WebReview.js')
var loadEntryManager = require('./pic-man/EntryManager.js').loadEntryManager;
var commanderFilter = require('./filter/CommandFilter');
var SlideShow = require('./web-man/ExpressSlideshow.js')


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
  .command('tags <managed>')
  .action(function(managed, cmd) {
    var entryManager = loadEntryManager(managed);
    for (var tag of entryManager.getTags().sort()) {
      console.log("   %s", tag);
    }
  });
  
program
  .command('review <managed>')
  .action(function(managed, cmd) {
    console.log("Reviewing managed at %s", managed);
    WebReview(managed);
  });

program
  .command('check <managed>')
  .action(function(managed, cmd) {
    console.log("Checking managed at %s", managed);
    new Check(managed).runCheck();
});

function collect(val, memo) {
  memo.push(val);
  return memo;
}

function addFilterOptions(command) {
  return command
  .option('-b --bypass-exclusion', 'Include all export exclusion media')
  .option('-m --media <type>', 'Restrict to media type (all, photo, video)', /^(all|photo|video)$/i, 'all')
  .option('-u --not-reviewed', 'Include media that has not been reviewed')
  .option('-f --include-folder [folder]', 'Directory name to include', collect, [])
  .option('-t --include-tag [tag]', 'Tag name to include', collect, [])
  .option('-e --exclude-folder [folder]', 'Directory name to exclude', collect, [])
  .option('-s --exclude-tag [tag]', 'Exclude content matching this tag', collect, []);
}

addFilterOptions(program.command('dry-run <managed>'))
  .action(function(managed, cmd) {
    var entryManager = loadEntryManager(managed);
    var ids = commanderFilter(cmd, entryManager);
    console.log("Id count:", ids.length);
    console.log(ids);
  });

addFilterOptions(program.command('slideshow <managed>'))
  .action(function(managed, cmd) {
    var entryManager = loadEntryManager(managed);
    var ids = commanderFilter(cmd, entryManager);
    SlideShow(ids, managed);
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

program
  .command('retag <managed> <tag> <newtag>')
  .action(function(managed, tag, newtag, cmd) {
    var tagged = {count:0};
    var entryManager = loadEntryManager(managed);
    entryManager.renameTag(tag, newtag);
    entryManager.save();
  });


program.parse(process.argv);
