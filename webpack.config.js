const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'demo/src/index.html'),
  filename: './index.html',
});

module.exports = {
  entry: path.join(__dirname, 'demo/src/index.js'),
  output: {
    path: path.join(__dirname, 'demo/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [htmlWebpackPlugin],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    port: 3001,
  },
};
