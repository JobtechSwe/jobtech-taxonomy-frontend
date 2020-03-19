var path = require('path');
var webpack = require('webpack');
var TerserPlugin = require('terser-webpack-plugin');

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
			},
			{
				test: /.css$/,
				use: 'css-loader'
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
    devServer: {
        disableHostCheck: true
    },	
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			parallel: true,
			terserOptions: {
				ecma: 6,
			},
		})],
	},
};
