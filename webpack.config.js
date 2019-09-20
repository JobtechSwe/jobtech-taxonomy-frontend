var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/index.jsx',
	output: { 
		path: __dirname, 
		filename: './src/bundle.js' 
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				},
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	}
};