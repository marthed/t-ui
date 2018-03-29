const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let loaders = [];

loaders.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: 'babel-loader',
});

loaders.push({
  test: /\.css$/,
  loaders: ['style-loader', 'css-loader']
});

module.exports = {
  entry: {
    app: './client/app.jsx'
  },
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
  module: {
    rules: loaders
  },
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'public/dist')
  }
};