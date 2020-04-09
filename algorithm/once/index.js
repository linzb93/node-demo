//只执行一次Promise
let timer = null;
function forever() {
  clearTimeout(timer);
  return new Promise((res, rej) => {
    timer = setTimeout(() => {
      rej('接口超时');
    }, 5000);
  })
}


module.exports = (pFunc, ...payload) => {
  let used = false;
  let p1 = forever();
  let p2 = forever();
  return () => {
    if (!used) {
      used = true;
      p1 = pFunc(...payload);
    }
    return Promise.race([p1, p2])
  };
}