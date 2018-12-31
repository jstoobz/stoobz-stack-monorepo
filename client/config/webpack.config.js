const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const configPaths = require('./paths')
const parts = require('./webpack.parts')
const APP_DIR = path.resolve(__dirname, '../src')
const BUILD_DIR = path.resolve(__dirname, '../dist')
const PUBLIC_DIR = path.resolve(__dirname, '../public')

const commonConfig = merge([
  {
    context: APP_DIR,
    target: 'web', // defaults as web, CHECK to make sure this is set properly
    // mode: isProd ? 'production' : 'develoment',
    entry: ['@babel/polyfill', APP_DIR + '/index.js'],
    output: {
      path: BUILD_DIR,
      publicPath: '/',
      // filename: 'static/js/[name].[hash:8].js',
      // filename: 'static/js/[name].[chunkhash:8].js',
      // chunkFilename: 'static/js/[name].[chunkhash:8].js',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    // devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'static/fonts/[name].[hash:8].[ext]',
            },
          },
        },
        {
          test: /\.(csv|tsv)$/,
          use: ['csv-loader'],
        },
        {
          test: /\.xml$/,
          use: ['xml-loader'],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              // options: { minimize: true }
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: './index.html',
        title: 'stoobz stack',
        template: PUBLIC_DIR + '/index.html',
        favicon: PUBLIC_DIR + '/favicon.ico',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ],
  },
  parts.loadJavaScript({ exclude: /node_modules/ }),
  parts.setFreeVariable('HELLO', 'hello from config'),
])

// const commonConfig = merge([
// parts.loadJavaScript({ include: PATHS.app }),
//   {
//     plugins: [
//       new HtmlWebpackPlugin({
//         filename: './index.html',
//         title: 'stoobz stack',
//         template: PUBLIC_DIR + '/index.html',
//         favicon: PUBLIC_DIR + '/favicon.ico',
//         // inject: true //added
//       }),
//     ],
//   },
// ])

const productionConfig = merge([
  {
    output: {
      filename: 'static/js/[name].[chunkhash:8].js',
      chunkFilename: 'static/js/[name].[chunkhash:8].js',
    },
  },
  parts.clean(BUILD_DIR),
  parts.minifyJavaScript(),
  // parts.minifyCSS({
  //   options: {
  //     discardComments: {
  //       removeAll: true,
  //     },
  //     safe: true,
  //   },
  // }),
  parts.extractCSS({
    use: [
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          // modules: true // provides local scope for every module by making every class declared within unique by including a hash in their name that is globally unique to the module
          // sourceMap: true,
        },
      },
      parts.autoprefix(),
      'sass-loader',
    ],
  }),
  parts.purifyCSS({
    paths: glob.sync(`${APP_DIR}/**/*.js`, { nodir: true }),
  }),
  /**
   * Add an extra argument in parts.loadCSS() to accept a boolean value on whether the env is set to prod
   * or dev and if it's in prod, perform the image optimizations
   */
  parts.loadAndCompressImages({
    options: {
      limit: 15000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  }),
  parts.generateSourceMaps({ type: 'source-map' }),
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'initial',
          },
        },
      },
      runtimeChunk: {
        name: 'manifest',
      },
      // splitChunks: {
      //   chunks: 'initial',
      // },
    },
  },
])

/**
 * If in dev mode to help fix HMR issue with creating new files with different hashes upon change, maybe implement an [id].name.[ext] etc,
 * an example was found in a previous post
 */
const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
])

module.exports = mode => {
  // console.log(`

  //   MODE: ${JSON.stringify(mode)}

  // `)
  if (mode === 'production') {
    // console.log('\x1b[36m%s\x1b[0m', 'Building for production ...');

    console.log(`MODE: ${JSON.stringify(mode)}`)

    return merge(commonConfig, productionConfig, { mode })
  }
  console.log(`MODE_SHOULDBEDEV: ${JSON.stringify(mode)}`)

  return merge(commonConfig, developmentConfig, { mode })
}
