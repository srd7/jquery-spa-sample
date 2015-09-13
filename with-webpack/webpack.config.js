module.exports = {
  resolve: {
    modulesDirectories: ["node_modules"],
    extensions: ["", ".js"]
  },
  output: {
    filename: "main.js"
  },
  module: {
    loaders: [
      { test: /\.jade$/, loader: require.resolve("jade-loader")}
    ]
  },
  status: {
    colors: true
  },
  devtool: "source-map",
  watch: true,
  keepalive: true
};
