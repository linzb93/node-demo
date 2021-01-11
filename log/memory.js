function logMemory() {
	let counter = 0;
	const timer = setInterval(() => {
		const mem = process.memoryUsage();
		log(`已申请内存：${byteFormat(mem.heapTotal)}，已使用内存：${byteFormat(mem.heapUsed)}`);
		counter++;
		if (counter >= 100) {
			clearInterval(timer);
		}
	}, 1000);
}
function byteFormat(bytes) {
	return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}
function log(text) {
	fs.appendFile(`${process.cwd()}/mem.txt`, `${text}\n`);
}