#!/usr/bin/env node

var program = require('commander');
var PicManInit = require('./pic-man/PicManInit.js')


program
  .command('import <dir> <managed>')
  .action(function(dir, managed, cmd) {
    console.log('import directory: %s', dir);
    console.log('managed directory: %s', managed);
  })
program.command('init <managed>')
  .action(function(managed, cmd) {
    new PicManInit(managed).init();
  })

program.parse(process.argv);
