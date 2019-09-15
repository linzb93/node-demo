/**
 * 这段代码是我用来检测自己收集的awesome-npm里面有多少个包
 */
const fs = require('fs');
const pify = require('pify');
const MarkdownIt = require('markdown-it');
const cheerio = require('cheerio');
const chalk = require('chalk');
const md = new MarkdownIt();
const readFile = pify(fs.readFile);

readFile('', 'utf8')
.then(res => {
  const $ = cheerio.load(md.render(res));
  const itemLength = $('ul').slice(1).find('li').length;
  console.log(`共有${chalk.yellow(itemLength)}个npm包`);
});