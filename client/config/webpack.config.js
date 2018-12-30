const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const GoogleFontsPlugin = require('google-fonts-webpack-plugin')

const parts = require('./webpack.parts')

const APP_DIR = path.resolve(__dirname, '..', 'src')
const BUILD_DIR = path.resolve(__dirname, '..', 'dist')
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public')

const commonConfig = merge([
  {
    context: APP_DIR,
    entry: ['@babel/polyfill', APP_DIR + '/index.js'],
    output: {
      path: BUILD_DIR,
      publicPath: '/',
      filename: 'static/js/[name].[hash:8].js',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.(gif|jpe?g|png|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                // name: 'static/media/[name].[ext]',
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65,
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75,
                },
              },
            },
          ],
          // test: /\.(png|svg|jpe?g|gif)$/,
          // use: [
          //   {
          //     loader: 'file-loader',
          //     options: {
          //       // name: 'static/media/[name].[ext]',
          //       name: 'static/media/[name].[hash:8].[ext]',
          //     },
          //     // loader: 'url-loader',
          //     // options: {
          //     //   // name: 'static/media/[name].[ext]',
          //     //   // name: 'static/media/[name].[hash:8].[ext]',
          //     // },
          //   },
          // ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'static/fonts/[name].[ext]',
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
      new CleanWebpackPlugin([BUILD_DIR], { allowExternal: true }),
      new HtmlWebpackPlugin({
        filename: './index.html',
        title: 'stoobz stack',
        template: PUBLIC_DIR + '/index.html',
        favicon: PUBLIC_DIR + '/favicon.ico',
      }),
      new GoogleFontsPlugin({
        name: 'gfonts',
        filename: 'static/fonts/gfonts.css',
        formats: ['eot', 'woff', 'woff2', 'ttf', 'svg'],
        local: true,
        fonts: [
          {
            family: 'Quicksand',
            variants: ['500', '700'],
          },
        ],
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ],
  },
])

// const commonConfig = merge([
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
  // dev,
  parts.loadCSS(),
  // parts.extractCSS(),
  // parts.extractCSS({
  //   // use: ['css-loader', 'postcss-loader', 'sass-loader']
  //   use: [
  //     {
  //       loader: 'css-loader',
  //       options: {
  //         importLoaders: 2,
  //       },
  //     },
  //     {
  //       loader: 'postcss-loader',
  //       options: {
  //         plugins: () => [require('autoprefixer')],
  //       },
  //     },
  //     'sass-loader',
  //   ],
  // }),
])

const developmentConfig = merge([
  // dev,
  parts.loadCSS(),
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
])

module.exports = mode => {
  if (mode === 'production') {
    console.log(`MODE: ${JSON.stringify(mode)}`)

    return merge(commonConfig, productionConfig, { mode })
  }
  console.log(`MODE: ${JSON.stringify(mode)}`)

  return merge(commonConfig, developmentConfig, { mode })
}
