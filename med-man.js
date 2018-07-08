#!/usr/bin/env node

var program = require('commander');
var PicManInit = require('./pic-man/PicManInit.js')
var DirectoryImporter = require('./pic-man/DirectoryImporter.js')


program
  .command('import <dir> <managed>')
  .option('-n, --nocopy', 'Index but do not copy')
  .option('-m, --move', 'Move media instead of copy it')
  .action(function(dir, managed, cmd) {
    new DirectoryImporter(dir, managed, cmd);
  });

program.command('init <managed>')
  .action(function(managed, cmd) {
    new PicManInit(managed).init();
  });

program.parse(process.argv);
