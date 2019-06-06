const path = require('path')
const theme = require('./package.json').theme
const webpack = require('webpack')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
//使用该插件会造成Antd Form.Item getFieldDecorator validation验证无效，注释掉
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        app: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    mode: "production",
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
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
                    'file-loader?outputPath=images/',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "fonts/[name].[ext]",
                    },
                },
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        historyApiFallback: true,
    },
    optimization: {
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false, // set to true if you want JS source maps
            uglifyOptions: {
                compress: {
                    pure_funcs:['console.log', 'console.error']
                }
            }
          }),
          // Compress extracted CSS. We are using this plugin so that possible
          // duplicated CSS from different components can be deduped.
          new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins:[
        // new LodashModuleReplacementPlugin(),
        new htmlWebpackPlugin({
            template:'public/index.html' 
        }),
        new CopyPlugin([
            { from: 'public/favicon.ico', to: 'favicon.ico' },
            { from: 'public/manifest.json', to: 'manifest.json' },
          ]),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            // 'process.env.NETWORK_AREA': JSON.stringify('production')
            'process.env.NETWORK_AREA': JSON.stringify('internal')
        })
    ]
}