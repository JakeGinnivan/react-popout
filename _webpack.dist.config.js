module.exports = {
  entry: ['./lib/react-popout.jsx'],
  output: {
    path: __dirname + '/dist',
    filename: 'react-popout.min.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.j(s|sx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-0', 'react']
      }
    }]
  },
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom'
    }
  }
};
