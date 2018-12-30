const path = require('path')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV !== 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    contentBase: path.resolve(__dirname, '..', 'dist'),
    compress: true,
    hot: true,
    historyApiFallback: true,
    stats: 'errors-only',
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    open: true,
    overlay: true,
    proxy: {
      '/api/**': 'http://localhost:5000',
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
})

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')()],
  },
})

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)?ss$/,
        include,
        exclude,
        use: [
          // 'style-loader',
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
            },
          },
          'sass-loader',
        ],
      },

      // {
      //   test: /\.css$/,
      //   include,
      //   exclude,

      //   use: ['style-loader', 'css-loader']
      // }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
    }),
  ],
})

// exports.extractCSS = () => {
//   // exports.extractCSS = ({ include, exclude = {}, use = [] }) => {
//   // Output extracted CSS to a file
//   // const plugin = new MiniCssExtractPlugin({
//   //   filename: '/static/css/[name].css'
//   // })

//   return {
//     module: {
//       rules: [
//         {
//           test: /\.(sa|sc|c)?ss$/,
//           // include,
//           // exclude,

//           // use: [MiniCssExtractPlugin.loader].concat(use)
//           use: [
//             // 'style-loader',
//             MiniCssExtractPlugin.loader,
//             {
//               loader: 'css-loader',
//               options: {
//                 importLoaders: 2,
//               },
//             },
//             {
//               loader: 'postcss-loader',
//               options: {
//                 plugins: () => [require('autoprefixer')],
//               },
//             },
//             'sass-loader',
//           ],
//         },
//       ],
//     },
//     plugins: [
//       new MiniCssExtractPlugin({
//         filename: 'static/css/[name].[contenthash:8].css',
//       }),
//     ],
//   }
// }
