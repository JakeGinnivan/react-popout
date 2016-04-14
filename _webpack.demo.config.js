module.exports = {
  entry: ['./demo/exampleContainer.jsx'],
  output: {
    path: './demo',
    filename: 'examples.js'
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
