const path = require('path')

const configPaths = {
  APP_DIR: path.resolve(__dirname, '..', 'src'),
  BUILD_DIR: path.resolve(__dirname, '..', 'dist'),
  PUBLIC_DIR: path.resolve(__dirname, '..', 'public'),
}

module.export = configPaths

// const PROJECT_ROOT = path.resolve(__dirname, '../');
// module.exports = {
//   projectRoot: PROJECT_ROOT,
//   outputPath: path.join(PROJECT_ROOT, 'dist'),
//   appEntry: path.join(PROJECT_ROOT, 'src')
// };
