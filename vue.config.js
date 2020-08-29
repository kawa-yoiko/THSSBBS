const webpack = require('webpack');

module.exports = {
  // chainWebpack: config => config.optimization.minimize(false),
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\/\\]dist[\/\\]locale$/, /zh-cn/),
    ],
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://simplebbs.iterator-traits.com/',
        ws: false,
        changeOrigin: true,
      }
    }
  }
};
