// 获取最大的文件夹
const fs = require('fs');
const path = require('path');
const bytes = require('bytes');
const root = 'D:/桌面/coding/Node/cli';
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
let list = [];
readFileRecursive(root, dest => {
  list.push(dest);
})
  .then(() => {
    size = list.reduce((a, b) => {
      return a + fs.statSync(b).size;
    }, 0);
    console.log(bytes(size, { decimalPlaces: 0 }));
  })