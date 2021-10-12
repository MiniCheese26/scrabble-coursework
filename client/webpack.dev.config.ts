import * as path from 'path';

import {Configuration as WebpackConfiguration, HotModuleReplacementPlugin} from 'webpack';
import {Configuration as WebpackDevServerConfiguration} from 'webpack-dev-server';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],

          },
        },
      },
      {
        test: /\.(png|woff|woff2)$/i,
        exclude: /node_modules/,
        loader: 'file-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      Types: [
        path.resolve(__dirname, 'src/App/types'),
        path.resolve(__dirname, '../sharedTypes')
      ],
      Styles: path.resolve(__dirname, 'src/App/styles'),
      Components: path.resolve(__dirname, 'src/App/components'),
      Resources: path.resolve(__dirname, 'src/App/resources'),
      Pages: path.resolve(__dirname, 'src/App/pages'),
      Classes: path.resolve(__dirname, 'src/App/classes'),
      Hooks: path.resolve(__dirname, 'src/App/hooks'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new HotModuleReplacementPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false
    }),
    new CleanWebpackPlugin({

    })
  ],
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    historyApiFallback: true,
    port: 4000,
    open: true,
    hot: true,
    clientLogLevel: 'none'
  },
};

export default config;
