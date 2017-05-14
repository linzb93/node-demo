var webpack = require('webpack');

webpack({
    entry: {
        main: './main.js'
    },
    output: {
        filename: 'app.js'
    }
}, function(err) {
    if (err) {
        throw err;
    }
});