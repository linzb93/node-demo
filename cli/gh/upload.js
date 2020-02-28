const fs = require('fs-extra');
const inquirer = require('inquirer');
const {successLogger, errorLogger, warnLogger} = require('../lib/util');

const repository = `${process.env.HOME}/Documents/GitHub/node-demo`;

module.exports = async args => {
  const originFile = `${args[0]}.js`;
  const dest = args[1];

  // 目标路径最多只能有一个"/"
  const slashLength = dest.split('').filter(item => item === '/').length;
  if (slashLength > 1) {
    errorLogger('目标文件路径有误，请重新填写');
    return;
  }
  if (slashLength === 0) {
    let dirs;
    try {
      dirs = await fs.readdir(`${repository}/${dest}`);
    } catch (e) {
      if (e.code === 'ENOENT') {
        warnLogger('目录不存在，将新建一个目录');
        await fs.mkdir(`${repository}/${dest}`);
      } else {
        errorLogger(e);
        return;
      }
    }
    if (!dirs) {
      dirs = [];
    }
    // 目标是文件夹，遍历其中的文件，询问是覆盖还是新建
    const {answer} = await inquirer.prompt([{
      type: 'list',
      name: 'answer',
      message: '请选择更新的文件，或者新建',
      choices: dirs.concat('新建')
    }]);
    if (answer === '新建') {
      const {input} = await inquirer.prompt([{
        type: 'input',
        name: 'input',
        message: '请输入新文件名'
      }]);
      try {
        await fs.copyFile(originFile, `${repository}/${dest}/${input}.js`);
      } catch (e) {
        errorLogger(e);
        return;
      }
      successLogger(`文件 ${dest}/${input}.js 添加成功`);
    } else {
      try {
        await fs.copyFile(originFile, `${repository}/${dest}/${answer}`);
      } catch (e) {
        errorLogger(e);
        return;
      }
      successLogger(`文件 ${dest}/${answer} 更新成功`);
    }
  } else if (slashLength === 1) {
    const pathExists = await fs.pathExists(`${repository}/${dest.split('/')[0]}`);
    if (!pathExists) {
      await fs.mkdir(`${repository}/${dest.split('/')[0]}`);
    }
    let newDest = dest;
    if (dest.split('/')[1] === '') {
      newDest = `${dest}${args[0]}`;
    }
    const fileExists = await fs.pathExists(`${repository}/${newDest}.js`);
    try {
      await fs.copyFile(originFile, `${repository}/${newDest}.js`);
    } catch (e) {
      errorLogger(e);
      return;
    }
    successLogger(`文件 ${newDest}.js ${fileExists ? '更新' : '添加'}成功`);
  }
}