const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CnameWebpackPlugin = require('cname-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/js/app.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'docs')
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [ "style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(frag|vert|glsl)$/,
        use: ['glsl-shader-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
    ],
  },
  devServer: {
    static: './docs',
    open: true
  },
  mode : 'development',
  resolve: {
    alias: {
      OrbitControls: path.join(__dirname, 'node_modules/three/examples/jsm/controls/OrbitControls.js'),
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "webpack + THREEjs boilerplate",
    }),
    new CnameWebpackPlugin({
      domain: 'juliodelvalle.com', // modify this line
    }),
    new FaviconsWebpackPlugin('./src/public/images/favicon.png')
  ],
};
