module.exports = {
  entry: ['./lib/react-popout.jsx'],
  output: {
    path: './dist',
    filename: 'react-popout.min.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    }
  }
};
