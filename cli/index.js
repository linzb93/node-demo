#!/usr/bin/env node

const program = require('commander');

program
.option('npm-s, --npm-search <name>');

program.parse(process.argv);

if (program.npmSearch) {
  require('./npmSearch')(program.npmSearch);
}