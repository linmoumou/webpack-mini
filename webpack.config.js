const path = require('path')
const CopyRightWebpackPlugin = require('./plugins/copyright-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js'
    },
    resolveLoader: {
        modules: ['node_modules','./loaders']
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: [{
                    loader: 'replaceLoader',
                    options: {
                        name: 'hello'
                    }
                }]
            }
        ]
    },
    plugins: [
        new CopyRightWebpackPlugin({
            
        })
    ]
}