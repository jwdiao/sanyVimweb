const path = require('path')
const theme = require('./package.json').theme
module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack-bundle.js',
        // publicPath: "../assets/"
    },
    mode: "development",
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: 'css-loader'
            },

            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS
                },{
                    loader: "less-loader",
                    options: {
                        javascriptEnabled: true,
                        modifyVars: theme
                    }
                }]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                // include:/public/,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ],
            }
        ]
    },
    // devServer: {
    //     contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'dist')]
    // }
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    }
}