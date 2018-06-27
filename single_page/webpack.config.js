const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
	entry: {
		index: ["babel-polyfill",'./js/index.js']
	},
	output: {
		path: join(__dirname, 'build'),
		filename: '[name].build.js'
	},
	module: {
		rules: [
			{
				test:/\.vue$/,
				use: [{
					loader: 'vue-loader',
					options: {
						loaders: {
							js: 'babel-loader',
							css: 'vue-style-loader!css-loader',
							sass: 'vue-style-loader!css-loader!sass-loader'
						}
					}
				}],
				exclude: /node_modules/
			},
			{
				test:/\.js$/,
				use: ['babel-loader'],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpg?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options:{
					limit: '10240',
					name: '[name].[ext]',
				}
			},
			{
	    	test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
	    	loader: 'file-loader'
		  }
		]
	},
	resolve: {	//后缀名查找
    extensions: [
      '.js',
      '.vue'
    ]
  },
	devServer: {
		contentBase: join(__dirname, 'build'),
		port: 83,
		host: '0,0,0,0',
		hot: true,
		inline: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index_template.html',
			inject: 'body',
			hash:false
		}),
		new CopyWebpackPlugin([
			{
				from: resolve(__dirname, 'static'),
	      to: 'static',
	      ignore: ['*/chrome1.png','*/chrome2.png','*/logo.png','*/title.png']
			}
		])
	],
}