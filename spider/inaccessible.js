// 检测网址是否可以访问
var axios = require('axios');
var cheerio = require('cheerio');
var fs = require('fs');
var open = require('open');
const pEach = require('p-each-series');
const iconvLite = require('iconv-lite')
const chalk = require('chalk');

function log(text, isRight) {
    if (isRight) {
        console.log(chalk.green(text));
    } else {
        console.log(chalk.red(text));
    }
}

axios.get('http://www.nd.com.cn/about/link.shtml', {
    responseType: 'arraybuffer'
})
.then(async res => {
    const $ = cheerio.load(iconvLite.decode(Buffer.concat([res.data]), 'gbk'));
    var arr = [];
    var ret = [];
    $('.product-link').eq(2).find('td a').each(function() {
        arr.push({
            title: $(this).text(),
            url: $(this).attr('href')
        });
    });
    await pEach(arr, async item => {
        try {
            await axios.get(item.url);
            log(`${item.title} 正常访问`, true);
        } catch(e) {
            ret.push(`${item.title} 无法访问`);
            if (e.response && e.response.statusText === 'Not Found') {
                log(`${item.title} : 网站不存在`);
            } else if (e.code === 'ETIMEDOUT') {
                log(`${item.title} : 访问超时`);
            } else {
                log(`${item.title} : 无法访问`);
            }
        }
    });

    let writeCon = '';
    if (ret.length === 0) {
        writeCon = '所有网站都正常访问';
    } else {
        writeCon = ret.join('\r\n');
    }
    fs.writeFile('demo.txt', writeCon, err => {
        if (err) throw err;
        open('./demo.txt');
    });
})
.catch(e => {
    log(e)
})