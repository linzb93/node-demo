const Listr = require('listr');
const fs = require('fs-extra');
const chalk = require('chalk');

fs.readdir('./task')
.then(files => {
  const list = files.map(file => {
    const {task, title} = require(`./task/${file}`);
    return {
      title: chalk.cyan(title),
      task: (_, tk) => task(tk)
    };
  })
  const tasks = new Listr(list, {
    exitOnError: false
  });
  tasks.run().catch(e => {
    e.errors.forEach(err => {
      console.log(err);
    })
  })
})