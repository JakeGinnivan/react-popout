module.exports = {
  entry: ['./demo/exampleContainer.jsx'],
  output: {
    path: __dirname + '/demo',
    filename: 'examples.js'
  },
  devServer: {
    contentBase: './demo',
    hot: true
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
};
