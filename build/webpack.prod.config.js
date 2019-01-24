const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack');

let webpackProdConfig = merge(webpackBaseConfig, {
    module: {
        rules: [
            {
                test: /\.(less|css)$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                modifyVars: { "@primary-color": "blue" },
                            }
                        }
                    ]
                })
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                },
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.CURRENT_ENV': JSON.stringify('production')
        }),
        //提取css至独立文件
        new ExtractTextWebpackPlugin({
            filename: '[name].[chunkhash:8].css'
        }),
        //压缩css
        new OptimizeCssAssetsPlugin()
    ]
});

module.exports = webpackProdConfig;