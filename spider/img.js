// 抓取一个页面里指定的图片
var fs = require('fs');
const axios = require('axios');
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
//目标网址
var page = 'http://www.baidu.com';
//本地存储目录
var dir = './bdimages';
//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});
//发送请求
axios.get(page)
.then(html => {
    const $ = cheerio.load(html.data);
    $('img').each(function() {
        const filename = $(this).attr('src').split('/').slice(-1)[0];
        const url = 'http:' + $(this).attr('src');
        axios.get(url, {
            responseType: 'stream'
        })
        .then(imgRes => {
            imgRes.data.pipe(fs.createWriteStream(`${dir}/${filename}`))
        })
    })
})
