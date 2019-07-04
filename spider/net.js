// 检测网址是否可以访问
const axios = require('axios');
const cheerio = require('cheerio');
const pEach = require('p-each-series');
const iconvLite = require('iconv-lite');
const chalk = require('chalk');
const ora = require('ora');
const ms = require('ms');
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
    const siteList = [];
    let count = {
      ok: 0, // 正常访问
      error: 0 // 无法访问
    }
    $('.product-link').find('td a').each(function () {
      siteList.push({
        title: $(this).text(),
        url: $(this).attr('href')
      });
    });
    await pEach(siteList, async item => {
      let spinner = ora(`正在检测 ${item.title}`).start();
      let startTime = new Date().getTime();
      try {
        await axios.get(item.url);
        let duration = ms(new Date().getTime() - startTime, {long: true});
        spinner.succeed(`${item.title} 正常访问，耗时${duration}`);
        count.ok++;
      } catch (e) {
        if (e.response && e.response.statusText === 'Not Found') {
          spinner.fail(`${item.title} 网站不存在`);
        } else if (e.code === 'ETIMEDOUT') {
          spinner.fail(`${item.title} 访问超时`);
        } else {
          spinner.fail(`${item.title} 无法访问`);
        }
        count.error++;
      }
    });
    console.log('\n');
    if (count.error === 0) {
      log('检测完成，所有网站均可正常访问');
    } else {
      logError(`检测完成，有${count.ok}个网站正常访问，${count.error}个网站无法访问`);
    }
  })
  .catch(e => {
    logError(e);
  });