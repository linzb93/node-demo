const { spawn } = require('child_process');
const iconv = require('iconv-lite');
const ls = spawn('ipconfig',{ encoding: 'buffer' });

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${iconv.decode(data,'cp936')}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`);
});