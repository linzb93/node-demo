module.exports = option => {
    return async function (ctx, next) {
        const start = Date.now();
        await next();
        const dir = Date.now() - start;
        if (option.limit > 10) {
            console.log('time: ' + dir);
        } else {
            console.log('no time: ' + dir);
        }
    }
}