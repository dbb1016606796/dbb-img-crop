/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
function getConfig(env) {
  const config = {
    mode: env,
    entry: './lib/ReactCrop',
    output: {
      path: path.resolve('dist'),
      library: 'ReactCrop',
      libraryTarget: 'umd',
      filename: env === 'production' ? 'ReactCrop.min.js' : 'ReactCrop.js',
      globalObject: 'this',
    },
    target: 'web',
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
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
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      new CleanWebpackPlugin(),
    ],
  };

  return config;
}

//module.exports = [getConfig('development'), getConfig('production')];
module.exports = [getConfig('production')];
