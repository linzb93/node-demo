const readline = require('readline');
const chalk = require('chalk');

module.exports = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  console.log(chalk.gray('请输入时间，按q结束：'));
  const stack = [];
  rl.on('line', (input) => {
    if (input === 'q') {
      varianceCal(stack);
      rl.close();
    } else if (validateInput(input)) {
      stack.push(input);
    }
  });
}

// 验证输入
function validateInput(input) {
  if (input.indexOf(':') === -1) {
    errorLogger('时间格式不对，分秒中间必须有个":"号');
    return false;
  }
  const seg = input.split(':');
  if (!isInteger(seg[0]) || Number(seg[0]) < 0 || Number(seg[0]) >= 60) {
    errorLogger('分钟必须为大等于0小于60的整数');
    return false;
  }
  if (!isInteger(seg[1]) || Number(seg[1]) < 0 || Number(seg[1]) >= 60) {
    errorLogger('秒数必须为大等于0小于60的整数');
    return false;
  }
  return true;
}
// 错误时的输出
function errorLogger(text) {
  console.log(chalk.red(text));
}
// 判断是否为整数
function isInteger(val) {
  // console.log(Number(val) === parseInt(val))
  return Number(val) === parseInt(val);
}

// 计算方差
function varianceCal(stack) {
  const secList = stack.map(item => {
    const seg = item.split(':');
    return parseInt(seg[0]) * 60 + parseInt(seg[1]);
  });
  const avg = parseInt(secList.reduce((sum, item) => sum + item, 0) / secList.length);
  const vari = parseInt(secList.reduce((sum, item) => sum + Math.pow(item - avg, 2), 0) / secList.length);
  console.log(`方差：${vari}`);
}