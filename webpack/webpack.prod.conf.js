var merge = require('webpack-merge');
var path = require('path');

function resolve(dir) {
    return path.resolve(__dirname, '..', dir);
}

module.exports = {
    output: {
        path: resolve('dist'),
        name: 'pekka.js'
    },
    module: {
        rules: [{
            test: '/\.js$/',
            loader: 'babel-loader',
            include: [resolve('src')]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};