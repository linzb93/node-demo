const fs = require('fs-extra');

function each(list, cb) {
  for (let i = 0; i < list.length; i++) {
    if (cb(list[i], i)) {
      break;
    }
  }
}

fs.readFile('./tree.json', 'utf8')
.then(file => {
  const treeList = JSON.parse(file);
  console.log(getNodeFromTree(treeList, node => node.name === '节点24'))
})

function getNodeFromTree(tree, cb) {
  let ret;
  each(tree, item => {
    if (cb(item)) {
      ret = item;
      return true;
    } else if (item.children && item.children.length) {
      ret = getNodeFromTree(item.children, cb);
    }
  })
  return ret;
}