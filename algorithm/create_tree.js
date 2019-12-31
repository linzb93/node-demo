const fs = require('fs-extra');
const prettier = require('prettier');
const uuid = require('uuid/v4');
const chalk = require('chalk');
/**
 * 创建递归对象
 * 思路：创建一个根节点和一个子节点后，子节点有两种选择，创建子节点或兄弟节点
 * 当数量到达一定值时，结束
 */
const totalNode = 30;
let counter = 0;
let path = [0]; // 当前操作的路径
let obj = [createTreeNode()];
while(counter < totalNode) {
  if (path.length === 1 && path[0] === 0) {
    // 目前在根节点
    if (obj[0].children) {
      obj[0].children.push(createTreeNode());
    } else {
      obj[0].children = [createTreeNode()];
    }
    path.push(obj[0].children.length - 1);
  } else {
    var is = isCreateChildNode();
    if (is) {
      let target = obj[0];
      for (let i = 1; i < path.length; i++) {
        target = target.children[path[i]];
      }
      if (target.children) {
        target.children.push(createTreeNode());
      } else {
        target.children = [createTreeNode()];
      }
      path.push(target.children.length - 1);
    } else {
      path.pop();
    }
  }
}
fs.writeFile('tree.json',prettier.format(JSON.stringify(obj), {
  parser:'json'
}))

function createTreeNode() {
  counter++;
  return {
    id: uuid(),
    name: `节点${counter}`
  }
}

function isCreateChildNode() {
  return Math.random() < 0.5;
}