const express = require('express');
const app = express();
const mainRouter = require('./router');
const bodyParser = require('body-parser');

app.set('views', './app/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('服务器已启动');
});