const Listr = require('listr');
const execa = require('execa');
const log4js = require('log4js');

log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');

const tasks = new Listr([
  {
    title: 'timeout',
    task: () => execa('node', ['test'])
  },
  {
    title: 'npm install',
    task: () => execa('cnpm', ['install', 'abc342wfw']).then(result => {
      if (result === '') {
        throw new Error('install error');
      }
    })
  }
])

tasks.run().catch(err => {
  logger.error(err);
})