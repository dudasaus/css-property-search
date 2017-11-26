const path = require('path');

module.exports = {
  entry: './dev/index.jsx',
  output: {
    path: path.join(__dirname, '/public/js/'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
