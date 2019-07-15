const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(path.resolve(__dirname, 'db.json'))
const db = low(adapter)
db.defaults({ items: []})
  .write();

 module.exports = () => {
  db.get('items').remove().write();
 }