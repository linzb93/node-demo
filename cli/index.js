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
    require('./npmSearch')(arg); // 搜索npm package下载量等信息
    break;
  case 'npm-c':
    require('./npmDb')(); // 清除本地npm搜索记录
    break;
  case 'access':
    require('./access')(); // 公司“精彩链接”能否正常访问
    break;
  case 'require':
    require('./require')(arg); // 一个js文件里面引用的npm package是否都已安装
    break;
  case 'gh':
    require('./gh')(arg); // 将本地node-demo代码上传至GitHub
    break;
  default:
    console.log(chalk.red('命令输入有误，请重新输入！'));
    break;
}