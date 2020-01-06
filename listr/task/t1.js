exports.task = task => new Promise((res, rej) => {
  setTimeout(() => {
    task.title = '任务1失败';
    rej('任务1失败');
  }, 3000);
});

exports.title = '任务1，3s后完成';