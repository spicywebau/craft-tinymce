const path = require('path')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    input: path.resolve(__dirname, '../src/scripts/main.ts'),
    'tinymce/skins/content/craft/content.min': path.resolve(__dirname, '../src/styles/content/content.less'),
    'tinymce/skins/ui/craft/content.min': path.resolve(__dirname, '../src/styles/ui/content.less'),
    'tinymce/skins/ui/craft/skin.min': path.resolve(__dirname, '../src/styles/ui/skin.less')
  },
  output: {
    path: path.resolve(__dirname, '../../src/resources'),
    filename: '[name].js'
  },
  externals: {
    jquery: 'jQuery',
    craft: 'Craft',
    garnish: 'Garnish',
    tinymce: 'tinymce'
  },
  resolve: {
    extensions: ['.ts', '.tsx']
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ]
  },
  module: {
    rules: [
      {
        use: ['ts-loader'],
        include: [path.resolve(__dirname, '../src')],
        test: /\.tsx?$/
      },
      {
        use: ['source-map-loader'],
        enforce: 'pre',
        test: /\.js$/
      },
      {
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        test: /\.css$/
      },
      {
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                math: 'always',
                relativeUrls: true
              }
            }
          }
        ],
        test: /\.less$/
      },
      {
        use: { loader: 'url-loader' },
        test: /\.(png|jpg|gif|svg|ttf|woff)$/
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin({
    filename: '[name].css'
  })]
}
