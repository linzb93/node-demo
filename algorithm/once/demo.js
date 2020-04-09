const once = require('./once');

function fetchData() {
  console.log('你请求了这个接口');
  return new Promise(res => {
    setTimeout(() => {
      res(parseInt(Math.random() * 10000));
    }, 2000);
  })
}

const middle = once(fetchData);

(async () => {
  const data = await middle();
  console.log(`第一次调取：${data}`);
})();
(async () => {
  const data = await middle();
  console.log(`第二次调取：${data}`);
})();
