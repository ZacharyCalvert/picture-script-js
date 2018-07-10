#!/usr/bin/env node

var program = require('commander');
var PicManInit = require('./pic-man/PicManInit.js')
var DirectoryImporter = require('./pic-man/DirectoryImporter.js')
var MigrateService = require('./pic-man/MigrateService.js')


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

program.parse(process.argv);
