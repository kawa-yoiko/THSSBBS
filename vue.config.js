module.exports = {
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
