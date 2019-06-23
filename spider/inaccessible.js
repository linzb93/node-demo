// 检测网址是否可以访问
const axios = require('axios');
const cheerio = require('cheerio');
const pEach = require('p-each-series');
const iconvLite = require('iconv-lite');
const chalk = require('chalk');
const ProgressBar = require('progress');
let bar = null;
function log(text) {
  console.log(chalk.green(text));
}

function logError(text) {
  console.log(chalk.red(text));
}

axios.get('http://www.nd.com.cn/about/link.shtml', {
    responseType: 'arraybuffer'
})
.then(async res => {
    const $ = cheerio.load(iconvLite.decode(Buffer.concat([res.data]), 'gbk'));
    const arr = [];
    let brokenLinkCount = 0;
    $('.product-link').find('td a').each(function() {
        arr.push({
            title: $(this).text(),
            url: $(this).attr('href')
        });
    });
    bar = new ProgressBar(':bar :percent', {
      total: arr.length,
      width: 60,
      complete: chalk.bgGreen(' '),
      incomplete: chalk.bgWhite(' ')
    });
    console.log('开始检测');
    await pEach(arr, async item => {
        try {
            await axios.get(item.url);
        } catch(e) {
            if (e.response && e.response.statusText === 'Not Found') {
              logError(`${item.title} : 网站不存在`);
            } else if (e.code === 'ETIMEDOUT') {
              logError(`${item.title} : 访问超时`);
            } else {
              logError(`${item.title} : 无法访问`);
            }
            brokenLinkCount++;
        } finally {
          bar.tick();
          if (bar.complete) {
            if (brokenLinkCount) {
              logError(`检测完成，有${brokenLinkCount}个网站无法访问。`);
            } else {
              log('检测完成，所有网站均可访问。')
            }
          }
        }
    });
})
.catch(e => {
  logError(e);
})