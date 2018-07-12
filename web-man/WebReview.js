const express = require('express')
const app = express();
var open = require("open");

var review = function(managed) {
  app.get('/', (req, res) => res.send('Hello World!'))
  app.listen(3000, () => open("http://localhost:3000"));
}

module.exports = review;