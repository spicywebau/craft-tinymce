const webpack = require('webpack')
const path = require('path')
const ExtractText = require('extract-text-webpack-plugin')

module.exports = {
	devtool: 'source-map',
	entry: {
		'input': path.resolve(__dirname, './src/main.js'),
		'tinymce/skins/craft/skin.min': path.resolve(__dirname, './src/skin/styles/Skin.less'),
		'tinymce/skins/craft/content.min': path.resolve(__dirname, './src/skin/styles/Content.less'),
	},
	output: {
		path: path.resolve(__dirname, './tinymce/resources'),
		filename: '[name].js',
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false },
			output: { comments: false },
			sourceMap: true,
		}),
		new ExtractText({
			filename: '[name].css',
		}),
	],
	externals: {
		jquery: 'jQuery',
		craft: 'Craft',
		garnish: 'Garnish',
		tinymce: 'tinymce',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: /src/,
				use: {
					loader: 'babel-loader',
					options: { presets: ['env'] },
				},
			},
			{
				test: /\.less$/,
				use: ExtractText.extract({
					use: [
						{ loader: 'css-loader' },
						{
							loader: 'less-loader',
							options: {
								cleancss: true,
								strictImports: true,
								compress: true,
							},
						},
					],
				}),
			},
			{
				test: /\.(png|jpg|gif|svg|ttf|woff)$/,
				use: { loader: 'url-loader' },
			},
		],
	},
}
