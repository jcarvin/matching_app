var path = require('path')

module.exports = {
  entry: 'app.js',
  output: {
    path: __dirname,
    filename: './out/bundle.js',
    libraryTarget: 'commonjs2',
    library: 'ITL'
  },
  devServer: {
    historyApiFallback: {
      index: '/index.html'
    },

    disableHostCheck: true
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom'
    },
    'infobate-transport-layer': 'infobate-transport-layer',
    'mobx': 'mobx',
    'mobx-react': 'mobx-react',
    'mobx-react-router': 'mobx-react-router',
    'material-ui': 'material-ui',
    'react-router': 'react-router',
    'react-select': 'react-select',
    'superagent': 'superagent',
    'superagent-bluebird-promise': 'superagent-bluebird-promise',
    'superagent-promise': 'superagent-promise',
    'superagent-promise-headers': 'superagent-promise-headers',
    'bluebird': 'bluebird'
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
          plugins: ['transform-runtime', 'transform-decorators-legacy', 'mobx-deep-action', 'add-module-exports']
        }
      }
    ]
  }
}
