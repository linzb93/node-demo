const glob = require('glob');
const fs = require('fs-extra');
const chalk = require('chalk');
const pMap = require('p-map');
const projectName = '在这里填写项目根目录';

glob(`${projectName}/src/**/*.vue`, (err, files) => {
  pMap(files, async file => {
    const filename = file.replace(`${projectName}/src/`, '');
    const cont = await fs.readFile(file, 'utf8');
    return {
      filename,
      count: cont.split('\n').length - 1
    };
  })
  .then(arr => {
    let ret = arr.filter(item => item.count >= 300).sort((a,b) => b.count - a.count);
    ret.forEach(item => {
      console.log(`文件 ${chalk.cyan(item.filename)} 有 ${chalk.yellow(item.count)} 行`);
    })
  })
});