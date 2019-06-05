// 检测网址是否可以访问
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const open = require('open');
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
    const targetList = [];
    const ret = [];
    $('.product-link').find('td a').each(function() {
        targetList.push({
            title: $(this).text(),
            url: $(this).attr('href')
        });
    });
    await pEach(targetList, async item => {
        try {
            await axios.get(item.url);
            log(`${item.title} 正常访问`, true);
        } catch(e) {
            ret.push(`${item.title} 无法访问`);
            if (e.code === 'ENOTFOUND') {
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
});
