#!/usr/bin/env node

var program = require('commander');

program
  .command('import <dir> <managed>')
  .action(function(dir, managed, cmd) {
    console.log('import directory: %s', dir);
    console.log('managed directory: %s', managed);
  })

program.parse(process.argv);
