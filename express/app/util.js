const dayjs = require('dayjs');

exports.named = function() {
  const suffix = Math.random().toString().slice(2,10); // 取8位随机数
  return `${dayjs().format('YYYYMMDDHHmmss')}${suffix}`;
}