var Mock = require('mockjs');
var data = Mock.mock({
    'list|1-10': [{
        'id': '@integer(1, 120)',
        'email': '@email(163.com)'
    }]
});
// 输出结果
console.log(data);