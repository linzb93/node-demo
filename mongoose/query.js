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

Blogs.find('*').sort('date').exec((err, items) => {
    console.log(items);
});

Blogs.find({tag: 'JavaScript'}, (err, items) => {
    console.log(items);
    mongoose.disconnect();
});