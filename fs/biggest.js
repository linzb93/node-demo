const fs = require('fs');
const path = require('path');
const bytes = require('bytes');
const chalk = require('chalk');
const pify = require('pify');
const open = require('open');
const inquirer = require('inquirer');

const readdir = pify(fs.readdir);
const stat = pify(fs.stat);

// 获取最大项
function getMaxItem(items, key) {
  let maxItem = items[0];
  items.forEach(item => {
    if (item[key] > maxItem[key]) {
      maxItem = item;
    }
  });
  return maxItem;
}

// 判断该路径下是否全是文件
function isAllFileInDir(absDir) {
  const dirs = fs.readdirSync(absDir);
  return dirs.every(dir => !fs.lstatSync(path.resolve(absDir, dir)).isDirectory());
}

// 递归搜索文件
function readFileRecursive(dir, exclude, callback) {
  return readdir(dir)
  .then(files => {
    const promiseFilesList = files
    .filter(file => !exclude.includes(file))
    .map(item => {
      const dest = path.join(dir, item);
      return stat(dest)
      .then(stats => {
        if (stats.isDirectory()) {
          return readFileRecursive(dest, exclude, callback);
        }
        callback(dest);
      });
    })
    return Promise.all(promiseFilesList);
  });
}

// 获取文件夹尺寸
function getDirSize(options) {
  const list = [];
  return readFileRecursive(options.root, options.exclude, dest => {
    list.push(dest);
  })
  .then(() => {
    const size = list.reduce((a, b) => {
      return a + fs.statSync(b).size;
    }, 0);
    return Promise.resolve({
      name: path.basename(options.root),
      isDirectory: true,
      size
    });
  });
}

// 完成检索后的操作
function afterFinished(dir) {
  console.log(chalk.green('检索完成，退出程序！'));
  open(dir);
}

// main
function traverseDir(options) {
  const absDir = options.root;
  const exclude = Array.isArray(options.exclude) ? options.exclude : [];
  console.log('=================================');
  console.log(`进入 ${absDir} 文件夹`);
  readdir(absDir)
  .then(files => {
    const pm = files
    .filter(file => !exclude.includes(file))
    .map(file => {
      return stat(path.resolve(absDir, file))
      .then(stats => {
        if (stats.isDirectory()) {
          return getDirSize({
            root: path.resolve(absDir, file),
            exclude: exclude
          });
        } else {
          return Promise.resolve({
            name: path.basename(file),
            isDirectory: false,
            size: stats.size
          });
        }
      })
    });
    return Promise.all(pm);
  })
  .catch(err => {
    if (err.code === 'ENOENT') {
      console.log(chalk.red('文件夹路径错误，请重新输入'));
    } else {
      console.log(err);
    }
  })
  .then(resList => {
    resList.forEach(res => {
      const transformedSize = bytes(res.size, { decimalPlaces: 1 });
      const output = res.size >= bytes(options.limit) ? chalk.red(transformedSize) : transformedSize;
      console.log(`${res.isDirectory ? '文件夹' : '文件'} ${res.name}: ${output}`);
    });
    const maxItem = getMaxItem(resList, 'size');
    console.log(chalk.green(`最大的${maxItem.isDirectory ? '文件夹' : '文件'}是 ${maxItem.name}`));
    if (maxItem.isDirectory && !isAllFileInDir(absDir)) {
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'toDeeper',
          message: '是否继续深度搜索？',
          default: false
        }
      ])
      .then(answer => {
        if (answer.toDeeper) {
          traverseDir({
            ...options,
            root: path.resolve(absDir, maxItem.name)
          })
        } else {
          afterFinished(absDir);
        }
      })
    } else {
      afterFinished(absDir);
    }
  });
}

traverseDir({
    root: '', // 需要查询的文件夹路径
    exclude: ['node_modules', '.git'], // 排除的文件夹
    limit: '10MB' // 最大的尺寸，超过的会有特殊标记
});