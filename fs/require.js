const fs = require('fs-extra');
const path = require('path')
function readFileRecursive(dir, callback) {
  return fs.readdir(dir)
    .then(files => {
      const promiseFilesList = files.map(item => {
        const dest = path.join(dir, item);
        return fs.stat(dest)
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
const fileList = [];
const pkgList = [];
readFileRecursive('D:/我的文档/GitHub/easymock/app', dest => {
  fileList.push(dest);
})
.then(() => {
  const pMap = fileList.map(dest => {
    return fs.readFile(dest, 'utf8')
    .then(file => {
      const patt = /require\('([a-z0-9-]+)'\)/g;
      let ret;
      while (ret !== null) {
        ret = patt.exec(file);
        if (ret) {
          pkgList.push(ret[1]);
        }
      }
      return Promise.resolve();
    });
  });
  return Promise.all(pMap);
}).then(() => {
  const s = new Set();
  pkgList.forEach(pkg => {
    s.add(pkg);
  });
  const newPkgList = Array.from(s);
  console.log(newPkgList.length);
});