// 抓取图片列表
const fs = require('fs');
const axios = require('axios');
const mkdirp = require('mkdirp');
const archiver = require('archiver');
const ora = require('ora');
const open = require('open');
//本地存储目录
const dir = './images';
// 图片名称列表
const imgList = [];
const prefix = '';
//创建目录
mkdirp(dir, function(err) {
  if(err){
    console.error(err);
  }
});

const pMap = imgList.map(item => {
  return axios.get(`${prefix}/${item}`, {
    responseType: 'stream'
  })
  .then(imgRes => {
    imgRes.data.pipe(fs.createWriteStream(`${dir}/${item}`));
    return Promise.resolve();
  })
  .catch(() => {
    console.error(`图片${item}下载失败`);
    return Promise.reject();
  })
});

Promise.all(pMap)
.then(() => {
  const output = fs.createWriteStream(__dirname + '/images.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  let spinner = ora('正在打包图片').start();
  output.on('close', function() {
    spinner.succeed('打包成功');
    open('./images');
  });
  archive.on('error', function(err) {
    spinner.fail(err);
  });
  archive.pipe(output);
  
  archive.directory('images')
  
  archive.finalize();
})
.catch(err => {
  console.error(err);
})
