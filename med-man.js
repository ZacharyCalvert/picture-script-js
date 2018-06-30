#!/usr/bin/env node

var program = require('commander');
var PicManInit = require('./pic-man/PicManInit.js')
var DirectoryImporter = require('./pic-man/DirectoryImporter.js')


program
  .command('import <dir> <managed>')
  .action(function(dir, managed, cmd) {
    console.log('import directory: %s', dir);
    console.log('managed directory: %s', managed);
    new DirectoryImporter(dir, managed);
  })
program.command('init <managed>')
  .action(function(managed, cmd) {
    new PicManInit(managed).init();
  })

program.parse(process.argv);
