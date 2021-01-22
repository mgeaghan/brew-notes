const path = require('path');

module.exports = {
	entry: {
		root: './src/js/root.js',
		home: './src/js/home.js',
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