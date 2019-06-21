const fs = require('fs');
const path = require('path');
const bytes = require('bytes');
const chalk = require('chalk');
const root = '';

// 简单实现一个promisify
function promisify(fn) {
  return (...args) => (
    new Promise((resolve, reject) => {
      args.push((...cbArgs) => {
        // 做error first兼容处理
        let err, result;
        if (cbArgs.length === 2) {
          err = cbArgs[0];
          result = cbArgs[1];
        } else if (cbArgs.length === 1) {
          result = cbArgs[0];
        }
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      fn.apply(null, args);
    })
  )
}

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// 递归搜索文件
function readFileRecursive(dir, callback) {
  return readdir(dir)
    .then(files => {
      const promiseFilesList = files.map(item => {
        const dest = path.join(dir, item);
        return stat(dest)
          .then(stats => {
            if (stats.isDirectory()) {
              return readFileRecursive(dest, callback);
            }
            callback(dest);
          }).catch(err => {
            console.log(err);
          });
      })
      return Promise.all(promiseFilesList);
    })
    .catch(err => {
      console.log(err);
    });
}

function getDirSize(roots) {
  const list = [];
  readFileRecursive(roots, dest => {
    list.push(dest);
  })
    .then(() => {
      const size = list.reduce((a, b) => {
        return a + fs.statSync(b).size;
      }, 0);
      const transformedSize = bytes(size, { decimalPlaces: 1 });
      const output = size >= bytes('1GB') ? chalk.red(transformedSize) : transformedSize;
      console.log(`${path.basename(roots)}: ${output}`);
    });
}

readdir(root)
  .then(files => {
    files.forEach(file => {
      stat(path.resolve(root, file))
        .then(stats => {
          if (stats.isDirectory()) {
            getDirSize(path.resolve(root, file));
          } else {
            console.log(`${path.basename(file)}: ${bytes(stats.size, { decimalPlaces: 1 })}`);
          }
        })
    })
  })