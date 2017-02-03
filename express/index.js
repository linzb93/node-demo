var express = require('express')
var app = express();
var fs = require('fs');
var JSON = require('json5');
var bodyParser = require('body-parser');

//body parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//设置assets文件夹内的文件可以直接访问
app.use(express.static('assets'));

// 获取请求数据
app.post('/', function (req, res) {
    console.log(req.body);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})