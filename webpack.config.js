const path = require('path');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './front/index.js',
    output: {
        path: path.resolve(__dirname, 'build/assets'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                'env',
                                {
                                    'targets': {
                                        'browsers': ['last 2 versions']
                                        // 'node': 'current'
                                    }
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    }
};