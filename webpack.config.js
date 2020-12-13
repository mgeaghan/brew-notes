const path = require('path');

module.exports = {
	entry: {
		main: './src/js/main.js',
		edit: './src/js/edit.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist/public/js'),
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
};