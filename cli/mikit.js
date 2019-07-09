const fs = require('fs');
const path = require('path');

const root = process.cwd();
const appendFileInfo = ['css/style.scss', 'js/api.js', 'js/common.js', 'js/index.js'];
const today = new Date();
let myInfo = `/*
* @author linzb(334758)
* @editor linzb(334758)
* @date ${today.getFullYear()}-${fixZero(today.getMonth() + 1)}-${fixZero(today.getDate())}
*/
`;
function fixZero(val) {
  if (val < 10) {
    return `0${val}`;
  }
  return val.toString();
}
module.exports = () => {
  appendFileInfo.forEach(file => {
    const dest = path.resolve(root, 'wwwroot', file);
    fs.appendFile(path.resolve(root, 'wwwroot', file), myInfo, err => {
      if (err) {
        throw err;
      }
    });
    fs.writeFile(dest, myInfo + fs.readFileSync(dest), err => {
      if (err) throw err;
    })
  });
  const pkg = path.resolve(root, './package.json');
  fs.access(pkg, fs.constants.F_OK, err => {
    if (!err) {
      fs.unlink(pkg, err => {
        if (err) throw err;
      });
    }
  });
}