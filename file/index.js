var fs = require('fs');
var path = require('path');

//读取文件内容
fs.readFile('101.html',(err, data) => {
  if (err) throw err;
  console.log(data.toString());
});


//读取文件目录
var p = '../node';

var file = fs.readdirSync(p);
file.forEach(function(file) {
    var filePath = path.join(p, file);
    console.log(filePath);
})