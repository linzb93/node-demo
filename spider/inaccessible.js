// 检测网址是否可以访问
var axios = require('axios');
var cheerio = require('cheerio');
var fs = require('fs');
var opn = require('opn');
const PQueue = require('p-queue');
const queue = new PQueue({ concurrency: 1 });

axios.get('http://777.nd.com.cn/news/link.html')
.then(async (html) => {
    const $ = cheerio.load(html.data);
    var arr = [];
    var ret = [];
    $('.product-link').find('td a').each(function() {
        arr.push({
            title: $(this).text(),
            url: $(this).attr('href')
        });
    });
    for (var i = 0; i < arr.length; i++) {
        try {
            let data = await axios.get(arr[i].url);
            await queue.add(() => data);
            console.log(arr[i].title + ' 正常访问');
        } catch (e) {
            ret.push(arr[i].title + ' 无法访问');
            if (e.response && e.response.statusText === 'Not Found') {
                console.log(arr[i].title + ':网站不存在');
            } else if (e.code === 'ETIMEDOUT') {
                console.log(arr[i].title + ':访问超时');
            } else {
                console.log(arr[i].title + ' 无法访问');
            }
        }
    }
    await queue.onEmpty();
    let writeCon = '';
    if (ret.length === 0) {
        writeCon = '所有网站都正常访问';
    } else {
        writeCon = ret.join('\r\n');
    }
    fs.writeFile('demo.txt', writeCon, err => {
        if (err) throw err;
        opn('./demo.txt');
    });
})