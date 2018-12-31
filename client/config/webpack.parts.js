// const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')

const configPaths = require('./paths')

exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new UglifyWebpackPlugin({ sourceMap: true })],
    // minimizer: [new UglifyWebpackPlugin({ sourceMap: false })],
  },
})

// change to no arguments and use configPaths.BUILD_DIR here
exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path], { allowExternal: true })],
})

exports.setFreeVariable = (key, value) => {
  const env = {}
  env[key] = JSON.stringify(value)

  return {
    plugins: [new webpack.DefinePlugin(env)],
  }
}

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')()],
    // sourceMap: true,
  },
})

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
})

// instead of chunkhash use contenthash that is generated based on the extracted content to make sure it is invalidated properly
exports.extractCSS = ({ include, exclude, use = [] }) => {
  const plugin = new MiniCssExtractPlugin({
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].css',
  })

  return {
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)?ss$/,
          include,
          exclude,
          use: [MiniCssExtractPlugin.loader].concat(use),
        },
      ],
    },
    plugins: [plugin],
  }
}

exports.purifyCSS = ({ paths }) => ({
  plugins: [new PurifyCSSPlugin({ paths })],
})

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)?ss$/,
        include,
        exclude,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
})

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
})

exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include,
        exclude,
        use: 'babel-loader',
      },
    ],
  },
})

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|jpe?g|png|svg)$/i,
        include,
        exclude,
        use: [
          {
            loader: 'file-loader',
            // loader: 'url-loader', // if set to url-loader, once it surpasses limit it wil default to file-loader
            options,
          },
        ],
      },
    ],
  },
})

exports.loadAndCompressImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|jpe?g|png|svg)$/i,
        include,
        exclude,
        use: [
          {
            loader: 'file-loader',
            // loader: 'url-loader', // if set to url-loader, once it surpasses limit it wil default to file-loader
            options,
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
      },
    ],
  },
})

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    contentBase: configPaths.BUILD_DIR,
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
