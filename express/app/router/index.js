const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pify = require('pify');
const path = require('path');
const upload = multer();
const {named} = require('../util');

const readdir = pify(fs.readdir);
const unlink = pify(fs.unlink);
const imageDir = './public/pic/';

router.get('/', (req, res) => {
  readdir(imageDir)
  .then(files => {
    const ret = files.map(file => ({src: '/pic/' + file}));
    res.render('index', {photos: ret});
  })
});

router.get('/upload', (_, res) => {
  res.render('upload');
});

router.post('/upload', upload.any(), (req, res) => {
  const oriBuffer = req.files[0].buffer;
  fs.writeFile(`${imageDir}${named()}${path.extname(req.files[0].originalname)}`, oriBuffer, (err) => {
    if (err) throw err;
    res.send('success');
  });
});

router.post('/delete', (req, res) => {
  const body = req.body;
  unlink(`${imageDir}${body.name}`)
  .then(() => {
    res.send({
      code: 200,
      message: 'success'
    });
  });
  
})

module.exports = router;