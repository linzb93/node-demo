const fs = require('fs');
const path = require('path');
const bytes = require('bytes');
const root = '';
let size = 0;

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
  let list = [];
  readFileRecursive(roots, dest => {
    list.push(dest);
  })
    .then(() => {
      size = list.reduce((a, b) => {
        return a + fs.statSync(b).size;
      }, 0);
      console.log(`${path.basename(roots)}: ${bytes(size, { decimalPlaces: 0 })}`);
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
            console.log(`${path.basename(file)}: ${bytes(stats.size, { decimalPlaces: 0 })}`);
          }
        })
    })
  })