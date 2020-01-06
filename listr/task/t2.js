exports.task = task => new Promise((res, rej) => {
  setTimeout(() => {
    task.title = '任务2完成';
    res();
  }, 2000);
})

exports.title = '任务2，2s后完成';