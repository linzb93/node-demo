// 妇联通网站数据更新
const fs = require('fs');
const XLSX = require('xlsx');
const buf = fs.readFileSync('');
const wb = XLSX.read(buf, {type:'buffer'});
const table = wb.Sheets.Sheet1;

let data = [];

for (let i = 2; i <= 32; i++) {
  data.push({
    name: table['A' + i].v,
    importAll: parseInt(table['B' + i].v),
    curImport: parseInt(table['C' + i].v),
    activeAll: parseInt(table['D' + i].v),
    curActive: parseInt(table['E' + i].v),
    curStudy: parseInt(table['F' + i].v),
  });
}

fs.writeFileSync('data.txt', JSON.stringify(data));