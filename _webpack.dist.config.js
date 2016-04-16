module.exports = {
  entry: ['./lib/react-popout.jsx'],
  output: {
    path: './dist',
    filename: 'react-popout.min.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        stage: 0
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
