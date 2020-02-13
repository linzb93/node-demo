const fs = require('fs-extra');
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const pFilter = require('p-filter');

module.exports = async args => {
  const pkgList = [];
  const cwd = process.cwd();
  let file;
  try {
    file = await fs.readFile(`${cwd}/${args[0]}.js`, 'utf8');
  } catch (e) {
    console.log(chalk.red(`文件${args[0]}.js 不存在`));
    return;
  }
  const patt = /require\('([a-z0-9-]+)'\)/g;
  let ret;
  while (ret !== null) {
    ret = patt.exec(file);
    if (ret) {
      pkgList.push(ret[1]);
    }
  }
  const filterList = await pFilter(pkgList, async pkg => {
    const ret = await fs.pathExists(`node_modules/${pkg}`);
    return !ret;
  });
  if (filterList.length === 0) {
    console.log(chalk.green(`没有需要安装的依赖`));
  } else {
    console.log(`${filterList.join(',')} 需要安装`);
    clipboardy.writeSync(`cnpm i ${filterList.join(' ')} -S`);
  }
}