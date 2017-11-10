var path = require('path')

module.exports = {
  entry: './app.js',
  output: { path: __dirname, filename: './out/bundle.js' }, // 'scorecard_bundle_beta.js'
  devServer: {
    historyApiFallback: {
      index: '/index.html'
    },

    disableHostCheck: true,
  },
  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.js', '.jsx', '.css'],
    alias: {
      base_components: 'components',
      css: 'css'
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'standard-loader'
      }
    ],
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader'},
      { test: /\.less$/, loader: 'style-loader!css!less' },
      { test: /\.svg$/, loader: 'url?limit=65000&mimetype=image/svg+xml&name=css/[name].[ext]' },
      { test: /\.woff$/, loader: 'url?limit=65000&mimetype=application/font-woff&name=css/[name].[ext]' },
      { test: /\.woff2$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=css/[name].[ext]' },
      { test: /\.[ot]tf$/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=css/[name].[ext]' },
      { test: /\.eot$/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=css/[name].[ext]' },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query:
        {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-runtime', 'transform-decorators-legacy', 'mobx-deep-action']
        }
      }
    ]
  }
}
