var path = require('path');
var utils = require('./utils');
var webpack = require('webpack');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const moduleName = 'views';
var entries = utils.getMultiEntry('./src/'+moduleName+'/**/**/*.js');//这里的路径是相对根目录（node的运行目录)
var chunks = Object.keys(entries);

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var webpack_config = {
	entry: entries,
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: utils.assetsPath('js/[name].js'),
		chunkFilename: utils.assetsPath('js/[id].js')	//不在entries中但需要加载的文件
	},
	resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
	module: {
		rules: [{
			test: /\.vue$/,
			use: [{
				loader: 'vue-loader',
				options: {
					loaders: utils.cssLoaders({
				    extract: true
				  }),
					postcss: [
						require('autoprefixer')({
				      browsers: ['iOS >= 7', 'Android >= 4.1']
				    })
					]
				}
			}]
		},{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src'), resolve('test')]
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[ext]')
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[ext]')
      }
    }]
	},
	devServer: {
      contentBase: path.join(__dirname, 'build'),
      port: 86,
      host: '0,0,0,0',
      hot: true,
      inline: true
  },
	plugins:[
		new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css')
    }),
    new OptimizeCSSPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: chunks,
	  	minChunks: 4 || chunks.length 
    }),
	]
}
webpack_config.module.rules = webpack_config.module.rules.concat(utils.styleLoaders({ extract: true }));
var pages =  utils.getMultiEntry('./src/'+moduleName+'/**/**/*.html');
for (var pathname in pages) {

  var conf = {
    filename: pathname + '.html',
    template: pages[pathname], // 模板路径
    chunks: ['vendor',pathname], // 每个html引用的js模块
    inject: true,              // js插入位置
		hash:true
  };
  webpack_config.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpack_config;