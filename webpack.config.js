const path = require('path');

module.exports = {
	entry: {
		main: './src/js/main.js',
		home: './src/js/home.js',
		edit: './src/js/edit.js',
		list: './src/js/list.js',
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