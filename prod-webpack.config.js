const path = require('path');
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

let webpackConfig = require('./webpack.config.js');

webpackConfig.entry = [
    './client.js'
];

webpackConfig.output = {
    path: path.join(__dirname, 'dist'),
    filename: 'orologio.js',
    publicPath: ''
};

webpackConfig.plugins = [
    new ParallelUglifyPlugin({
        uglifyES: {
            sourceMap: false,
            compress: { warnings: false },
            mangle: true
        }
    })
];

webpackConfig.resolve = {
    alias: {
        vue: 'vue/dist/vue.min.js'
    }
};

webpackConfig.devtool = undefined;

module.exports = webpackConfig;
