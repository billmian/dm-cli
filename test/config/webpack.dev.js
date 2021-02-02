// config/webpack.config.dev.js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.common.js");
const path = require("path");

module.exports = merge(baseConfig, {
  mode: "development",
  devServer: {
    port: 3000,
    host: "localhost",
    contentBase: path.join(__dirname, "../src"),
    watchContentBase: true,
    publicPath: "/",
    compress: true,
    historyApiFallback: true,
    hot: true,
    clientLogLevel: "error",
    open: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
});
