const fs = require('fs-extra');
const xlsx = require('node-xlsx');
const open = require('open');
(async () => {
    const cont = await fs.readFile('mt.json', 'utf8');
    const origin = JSON.parse(cont);
    const data = [];
    origin.forEach(item => {
        if (!item.id) {
            return;
        }
        item.ip = item.ip ? item.ip.replace(/\?t=[0-9]+/, '') : item.ip;
        for (let op of data) {
            if (item.ip === op.ip && item.detailTrace === op.detailTrace) {
                return;
            }
        }
        let resp = '未知';
        if (item.detailTrace) {
            resp = item.detailTrace.startsWith('errorInfo：') ? '前端' : '后端';
        }
        data.push({
            id: item.id,
            ip: item.ip,
            time: item.logTime.split('T')[0],
            detailTrace: item.detailTrace,
            userId: item.userId,
            resp
        })
    })
    const output = [
        {
            name: 'sheet1',
            data: [
                ['日志ID', '地址', '用户ID', '时间', '错误问题', '责任方'],
                ...data.map(item => {
                    return [item.id, item.ip, item.time, item.userId, item.detailTrace, item.resp]
                })
            ]
        }
    ]
    const options = {
        '!cols': [
            {wch: 40},
            {wch: 60},
            {wch: 15},
            {wch: 15},
            {wch: 100}
        ],
        '!outline': { above: true}
    }
    await fs.writeFile('./美团经营神器移动端bug0506.xlsx', xlsx.build(output, options));
    open('美团经营神器移动端bug0506.xlsx');
})()