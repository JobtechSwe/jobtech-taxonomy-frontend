var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

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
	},
    devServer: {
        disableHostCheck: true
    },	
	optimization: {
		minimizer: [new UglifyJSPlugin({
			extractComments: true,
			uglifyOptions: {
				warnings: false,
				parse: {},
				compress: {},
				mangle: true, // Note `mangle.properties` is `false` by default.
				output: null,
				toplevel: false,
				nameCache: null,
				ie8: false,
				keep_fnames: false,
			},
      })],
	},
};
