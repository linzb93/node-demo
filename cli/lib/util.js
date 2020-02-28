const chalk = require('chalk');

exports.errorLogger = function errorLogger(text) {
  console.log(chalk.red(text));
}

exports.successLogger = function successLogger(text) {
  console.log(chalk.green(text));
}

exports.warnLogger = function warnLogger(text) {
  console.log(chalk.yellow(text));
}