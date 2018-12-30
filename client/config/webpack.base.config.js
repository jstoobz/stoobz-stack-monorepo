const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

// const APP_DIR = path.resolve(__dirname, '/src')
// const BUILD_DIR = path.resolve(__dirname, '/dist')
// const PUBLIC_DIR = path.resolve(__dirname, '/public')
const APP_DIR = path.resolve(__dirname, '..', 'src')
const BUILD_DIR = path.resolve(__dirname, '..', 'dist')
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public')

const PORT = process.env.PORT || 8080
const isDev = process.env.NODE_ENV !== 'production'
const isProd = process.env.NODE_ENV !== 'development'
// const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  // context: __dirname + '../../',
  context: APP_DIR,
  // mode: isDev ? 'development' : 'production',
  // mode: 'development',
  entry: ['@babel/polyfill', APP_DIR + '/index.js'],
  output: {
    // path: !isDev ? BUILD_DIR : undefined,
    path: BUILD_DIR,
    publicPath: '/',
    filename: 'static/js/[name].[hash:8].js'
    // filename: 'static/js/[name].[contenthash:8].js'
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
  // devtool: 'cheap-module-eval-source-map',
  // devtool: 'inline-source-map',
  // stats: {
  //   errors: 'errors-only',
  //   colors: {
  //     green: '\u001b[32m'
  //   }

  // },
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
          'css-loader',
          'sass-loader'
        ]
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
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
            // options: { minimize: true }
          }
        ]
      }
    ]
  },
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all'
  //       }
  //     }
  //   }
  // },
  plugins: [
    new CleanWebpackPlugin([BUILD_DIR], { allowExternal: true }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      title: 'stoobz stack',
      template: PUBLIC_DIR + '/index.html',
      favicon: PUBLIC_DIR + '/favicon.ico'
      // inject: true //added
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
      // chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
      // filename: isDev ? '[name].css' : '[name].[hash].css',
      // chunkFilename: isDev ? '[id].css' : '[id].[hash].css'
      // filename: 'style.css' // works!
      // filename: 'app.[contenthash:8].css'
      // filename: 'static/css/[name].[contenthash:8].css'
    }),
    // new ExtractTextPlugin({
    //   filename: '[name].css',
    //   disable: true
    // }),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      // 'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
    })
  ],
  devServer: {
    contentBase: BUILD_DIR,
    // contentBase: PUBLIC_DIR,
    // contentBase: process.cwd(),
    // publicPath: '/',
    // publicPath: 'http://localhost:8080' // necessary to have full path when using HMR, keep same as output.publicPath
    compress: true,
    // port: PORT,
    // host: 0.0.0.0
    open: true,
    hot: true,
    // clientLogLevel: 'none',
    historyApiFallback: true,
    // overlay: true,
    // clientLogLevel: 'none',
    // noInfo: true,
    // stats: 'errors-only',
    // TRY ADDING THE BELOW?
    // contentBase: PUBLIC_DIR,
    // watchContentBase: true,
    // publicPath: '/',
    // quiet: true,
    // proxy: [{
    //   context: ['/auth', '/api'],
    //   target: 'http://localhost:5000',
    // }],
    proxy: {
      '/api/**': 'http://localhost:5000'
    }
  }
}
