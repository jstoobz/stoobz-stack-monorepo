const path = require('path')

const configPaths = {
  APP_DIR: path.resolve(__dirname, '..', 'src'),
  BUILD_DIR: path.resolve(__dirname, '..', 'dist'),
  PUBLIC_DIR: path.resolve(__dirname, '..', 'public'),
}

module.export = configPaths
