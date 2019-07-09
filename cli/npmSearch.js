const axios = require('axios');
const cheerio = require('cheerio');
const open = require('open');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const Table = require('cli-table3');
const table = new Table({
  head: [chalk.green('名称'), chalk.green('周下载量')]
});

function transformNumberCn(val) {
  // 12,345,678 => 1234万
  var value = Number(val.replace(/,/g, ''));
  if (value > 10000) {
    return `${parseInt(value / 10000)}万`;
  }
  return value;
}

const fetchNp = async args => {
  if (args.length === 1) {
    const packageName = args[0];
    let spinner = ora(`正在查找 ${packageName} 模块`).start();
    let res;
    try {
      res = await axios.get(`https://www.npmjs.com/package/${packageName}`);
    } catch (e) {
      if (e.response && e.response.statusText === 'Not Found') {
        spinner.fail(`没有 ${packageName} 这个模块`);
      } else if (e.code === 'ETIMEDOUT') {
        spinner.fail(`访问超时`);
      } else {
        spinner.fail(`无法访问`);
      }
      process.exit(0);
    }
    spinner.stop();
    const $ = cheerio.load(res.data);
    if (!$('._9ba9a726').length) {
      console.log(chalk.red(`可能 https://npmjs.com 重新发布，请修改。`));
      return;
    }

    /**
    * 获取描述文字
    * 如果第一段是徽章，就获取第二段，否则移除第一段里面的html标签
    */
    const $firstP = $('article p').first();
    const data = {
      desc: $firstP.text().trim() === '' ? $firstP.next().text() : $firstP.text(),
      weeklyDl: transformNumberCn($('._9ba9a726').text()),
      lastPb: $('.f2874b88 time').text()
    };
    console.log(`${chalk.bold(`关于${packageName}`)}:
  ${data.desc}
  周下载量：${chalk.green(data.weeklyDl)}
  上次更新：${chalk.green(data.lastPb)}`);
    const { openHomepage } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'openHomepage',
        message: '是否打开Github主页？',
        default: false
      }
    ]);
    if (openHomepage) {
      const url = $('.fdbf4038').children().eq(6).find('a').attr('href');
      open(url);
    }
  } else {
    let spinner = ora(`正在查找 ${args.join(' ')} 这些模块`).start();
    let resList;
    try {
      resList = await Promise.all(args.map(arg => axios.get(`https://www.npmjs.com/package/${arg}`)));
    } catch(e) {
      if (e.response && e.response.statusText === 'Not Found') {
        spinner.fail(`没有 ${e.config.url.split('/').pop()} 这个模块`);
      } else {
        spinner.fail(`无法访问`);
      }
      process.exit(0);
    }
    spinner.stop();
    const retList = resList.map(res => {
      const $ = cheerio.load(res.data);
      if (!$('._9ba9a726').length) {
        console.log(chalk.red(`可能 https://npmjs.com 重新发布，请修改。`));
        process.exit(0);
      }
      let obj = {};
      const key = res.config.url.split('/').pop();
      obj[key] = transformNumberCn($('._9ba9a726').text());
      return obj;
    });
    table.push(...retList)
    console.log(table.toString())
  }
}

module.exports = fetchNp;