const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Visualizer = require('webpack-visualizer-plugin')
const webpackBaseConfig = require('./webpack.base.config.js')

module.exports = merge(webpackBaseConfig, {
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new OptimizeCSSAssetsPlugin(),
    new Visualizer({
      filename: './statistics.html'
    })
  ]
})
