const crypto = require('crypto');

const content = 'password';
const buf = crypto.randomBytes(16); // 生成16位秘钥
const SecrectKey = buf.toString('hex');

let Signture = crypto.createHmac('sha1', SecrectKey);
Signture.update(content);
const cipher = Signture.digest().toString('base64');
console.log(`加密结果： ${cipher}`);