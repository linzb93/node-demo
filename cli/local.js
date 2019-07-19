const ora = require('ora');
const chalk = require('chalk');
const Table = require('cli-table3');
const fs = require('fs');
const pify = require('pify');
const table = new Table({
  head: [chalk.green('名称'), chalk.green('结果')]
});
const readdir = pify(fs.readdir);

module.exports = async args => {
  const spinner = ora(`正在查找 ${args.join(' ')}`).start();
  readdir('./node_modules')
  .then(files => {
    if (args.length === 1) {
      const package = args[0];
      if (files.includes(package)) {
        spinner.succeed(`找到 ${package}`);
      } else {
        spinner.fail(`没找到${package}`);
      }
    } else if (args.length > 1) {
      const ret = [];
      const packageList = args;
      spinner.stop();
      packageList.forEach(package => {
        ret.push([
          package,
          files.includes(package) ? '找到' : '没找到'
        ]);
      });
      table.push(...ret);
      console.log(table.toString());
    }
  });
}