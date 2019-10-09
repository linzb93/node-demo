// 抓取图片列表
var fs = require('fs');
const axios = require('axios');
var mkdirp = require('mkdirp');
//本地存储目录
var dir = './images';
// 图片名称列表
const imgList = [];
const prefix = '';
//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

imgList.forEach(item => {
  axios.get(`${prefix}/${item}`, {
    responseType: 'stream'
  })
  .then(imgRes => {
      imgRes.data.pipe(fs.createWriteStream(`${dir}/${item}`))
  })
  .catch(() => {
    console.log(`图片${item}下载失败`);
  })
});
