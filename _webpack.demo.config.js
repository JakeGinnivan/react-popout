module.exports = {
  entry: ['./demo/demo.jsx'],
  output: {
    path: './demo',
    filename: 'demo.js'
  },
  devServer: {
    contentBase: './demo',
    hot: true,
    inline: true
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
  }
};
