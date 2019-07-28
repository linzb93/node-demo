const jwt = require('jsonwebtoken');
const chalk = require('chalk');

const token = jwt.sign({foo: 'bar'}, 'shhhhh', {
  expiresIn: 4
});

setTimeout(() => {
  jwt.verify(token,'shhhhh', (err) => {
    if(err) {
      console.log(chalk.red('2s后，token过期'));
    } else {
      console.log(chalk.green('2s后，token有效'));
    }
  })
}, 2000);
setTimeout(() => {
  
  jwt.verify(token, 'shhhhh',(err) => {
    if(err) {
      console.log(chalk.red('6s后，token过期'));
    } else {
      console.log(chalk.green('6s后，token有效'));
    }
  })
}, 6000);