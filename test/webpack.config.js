/* eslint-env node */
const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'test.js'),
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', // 因为这里处理的是css文件，所以要放在sass-loader的上面
          'sass-loader',
        ],
      },
    ],
  },
};
