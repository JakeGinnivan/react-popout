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
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'},
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'}
    ]
  }
};
