const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

const APP_DIR = path.resolve(__dirname, '../src')
const BUILD_DIR = path.resolve(__dirname, '../dist')
const PUBLIC_DIR = path.resolve(__dirname, '../public')

const PORT = process.env.PORT || 8080
const isDev = process.env.NODE_ENV !== 'production'
// const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  // context: __dirname + '../../',
  // mode: isDev ? 'development' : 'production',
  // mode: 'development',
  entry: ['@babel/polyfill', APP_DIR + '/index.js'],
  output: {
    // path: !isDev ? BUILD_DIR : undefined,
    path: BUILD_DIR,
    publicPath: '/',
    filename: 'static/js/[name].[hash:8].js'
    // filename: 'static/js/[name].[chunkhash:8].js'
    // filename: !isDev
    //   ? 'static/js/[name].[chunkhash:8].js'
    //   : 'static/js/bundle.js'
    // filename: 'bundle.js'
    // ,
    // publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(sa|sc|c)?ss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          // 'style-loader',
          // MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
        // sideEffects: true
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([BUILD_DIR]),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: PUBLIC_DIR + '/index.html',
      favicon: PUBLIC_DIR + '/favicon.ico'
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
      // chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
      // filename: isDev ? '[name].css' : '[name].[hash].css',
      // chunkFilename: isDev ? '[id].css' : '[id].[hash].css'
      // filename: 'style.css' // works!
      // filename: 'static/css/[name].[contenthash:8].css'
    }),
    // new ExtractTextPlugin({
    //   filename: '[name].css',
    //   disable: true
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  devServer: {
    contentBase: BUILD_DIR,
    compress: true,
    port: PORT,
    open: true,
    hot: true,
    clientLogLevel: 'none',
    historyApiFallback: true,
    // stats: 'errors-only',
    proxy: {
      '/api/**': 'http://localhost:5000'
    }
  }
}
