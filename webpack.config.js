const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
    filename: '[name].css'/*,
    disable: process.env.NODE_ENV === 'development'
    */
});

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
            },
            {
                test: /\.less$/,
                use: extractLess.extract({
                    use: [
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "less-loader",
                            options: {
                                paths: [
                                    path.resolve(__dirname, "node_modules")
                                ]
                            }
                        }
                    ],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins: [
        extractLess
    ]
};