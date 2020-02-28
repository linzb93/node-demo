const fs = require('fs-extra');
const through = require('through2');
const split = require('binary-split');
const axios = require('axios');
const cheerio = require('cheerio');
const intoStream = require('into-stream');

fs.createReadStream('input.txt')
.pipe(split())
.pipe(through(async function(chunk, enc, callback) {
  let url = chunk.toString();
  let {data} = await axios.get(url);
  const $ = cheerio.load(data);
  const title = $('#activity-name').text().trim();
  let tarStr = '';
  let findRet = false;
  intoStream(data)
  .pipe(split())
  .on('data', line => {
    if (findRet) {
      return;
    }
    let str = line.toString();
    if (str.indexOf('document.getElementById("publish_time")') === -1) {
      tarStr = str;
    } else {
      findRet = true;
    }
  })
  .on('end', () => {
    let date = /[0-9]{4}-[0-9]{2}-[0-9]{2}/.exec(tarStr)[0];;
    this.push(
      `${JSON.stringify({
      title,
      url,
      date
    })
    .replace(/,/g, ',\n')
    .replace('"title', '\n"title')
    .replace('}', '\n}')},\n`
    );
    callback();
  });
}))
.pipe(fs.createWriteStream('output.txt'));