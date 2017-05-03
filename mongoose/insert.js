var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/blog');
var bluebird = require('bluebird');

var blogSchema = new mongoose.Schema({
      id: Number,
      title: String,
      tag: String,
      date: Date,
      desc: String
});
var Blogs = mongoose.model('blogs', blogSchema);

mongoose.Promise = Promise;

var data1 = new Blogs({
    id: +new Date(),
    title: '测试',
    tag: 'HTML',
    date: new Date(),
    desc: '一些描述'
});

var p1 = data1.save();
p1.then(doc => {
    console.log(doc);
    mongoose.disconnect();
})