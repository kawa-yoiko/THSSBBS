const webpack = require('webpack');

module.exports = {
  // chainWebpack: config => config.optimization.minimize(false),
  chainWebpack: config => config.plugin('html').tap(
    args => { args[0].title = 'THSSBBS'; return args; }
  ),
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
