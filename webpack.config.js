module.exports = {
  entry: './web-man/static/index.js',
  mode: 'development',
  output: {
    path: __dirname + '/web-man/public',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.js$/, use: 'babel-loader' }
    ]
  }
};
