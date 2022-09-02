const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    devtool: 'source-map',
    entry: {
        'input': path.resolve(__dirname, '../src/main.js'),
        'tinymce/skins/craft/skin.min': path.resolve(__dirname, '../src/skin/styles/Skin.less'),
        'tinymce/skins/craft/content.min': path.resolve(__dirname, '../src/skin/styles/Content.less'),
    },
    output: {
        path: path.resolve(__dirname, '../../src/resources'),
        filename: '[name].js',
    },
    externals: {
        jquery: 'jQuery',
        craft: 'Craft',
        garnish: 'Garnish',
        tinymce: 'tinymce',
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    module: {
        rules: [
            {
              use: [MiniCssExtractPlugin.loader, 'css-loader'],
              test: /\.css$/
            },
            {
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
              test: /\.less$/
            },
            {
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        targets: {
                          firefox: '67',
                          chrome: '63',
                          safari: '11',
                          edge: '79'
                        }
                      }
                    ]
                  ]
                }
              },
              include: [path.resolve(__dirname, '../src')],
              test: /\.jsx?$/
            },
            {
                use: { loader: 'url-loader' },
                test: /\.(png|jpg|gif|svg|ttf|woff)$/,
            },
        ],
    },
    plugins: [new MiniCssExtractPlugin({
      filename: '[name].css'
    })]
}
