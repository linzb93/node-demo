const express = require('express');
const app = express();
const open = require('open');
const router = express.Router();

app.set('view engine', 'ejs');

router.get('/', (req, res) => {
  res.render('index', {title: 'http://localhost:3000'})
});

app.use('/', router);

app.listen(3000, () => {
  open('http://localhost:3000/');
});