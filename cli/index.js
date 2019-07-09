#!/usr/bin/env node
const meow = require('meow');

const cli = meow();

const type = cli.input[0];
const arg = cli.input.slice(1);

switch(type) {
  case 'mikit':
    require('./mikit')();
    break;
  case 'npm-s':
    require('./npmSearch')(arg);
    break;
  default:
    console.log('命令输入有误，请重新输入！');
    break;
}