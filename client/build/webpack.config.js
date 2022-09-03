const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    input: path.resolve(__dirname, '../src/scripts/main.ts'),
    'tinymce/skins/ui/craft/skin.min': path.resolve(__dirname, '../src/skin/styles/Skin.less'),
    'tinymce/skins/ui/craft/content.min': path.resolve(__dirname, '../src/skin/styles/Content.less')
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
    minimizer: [new TerserPlugin()]
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
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
