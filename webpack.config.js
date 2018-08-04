const path = require('path')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
		review: "./web-man/static/index.js",
		slideshow: "./web-man/static/slideshow.js"
	},
  output: {
    path: path.join(__dirname, '/web-man/public')
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader']},
      { test: /\.js$/, use: 'babel-loader' }
    ]
  },
  plugins: [
     new webpack.ProvidePlugin({
       '$': "jquery",
       'jQuery': "jquery",
       'Popper': 'popper.js'
      })
  ],
  devServer: {
    contentBase: path.join(__dirname, '/web-man/public'), // serve your static files from here
    watchContentBase: true, // initiate a page refresh if static content changes
    proxy: [ // allows redirect of requests to webpack-dev-server to another destination
      {
        context: ['/ids', '/media', '/entry'],  // can have multiple
        target: 'http://localhost:3000', // server and port to redirect to
        secure: false,
      },
    ],
    port: 3030, // port webpack-dev-server listens to, defaults to 8080
    overlay: { // Shows a full-screen overlay in the browser when there are compiler errors or warnings
      warnings: false, // defaults to false
      errors: false, // defaults to false
    },
  }
};
