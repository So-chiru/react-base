require('dotenv').config()

const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { DefinePlugin } = require('webpack')

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin()

module.exports = (_, argv) => {
  const devMode = argv.mode === 'development'

  const options = {
    entry: path.resolve('src', 'index.tsx'),
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './tsconfig.json'),
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'fast-sass-loader']
        },
        {
          test: /\.(ico|png|jpg|jpeg|json)?$/,
          loader: 'file-loader',
          options: {
            name: '[hash].[ext]'
          }
        }
      ]
    },
    plugins: [
      // new DefinePlugin({
      //   'process.env.ENV_VALUE': JSON.stringify(process.env.ENV_VALUE)
      // }),
      // new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public'
          }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css'
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html'
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }

  options.mode = argv.mode

  if (devMode) {
    options.devtool = 'source-map'
    options.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 8080,
      historyApiFallback: true
    }

    return smp.wrap(options)
  }

  return options
}
