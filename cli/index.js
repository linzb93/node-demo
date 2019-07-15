#!/usr/bin/env node
const meow = require('meow');
const chalk = require('chalk');

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
  case 'npm-c':
    require('./npmDb')();
    break;
  default:
    console.log(chalk.red('命令输入有误，请重新输入！'));
    break;
}