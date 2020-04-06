const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  filenameHashing: true,
  lintOnSave: true,
  runtimeCompiler: false,
  productionSourceMap: false,
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/crossDomain': {
        target: '<url>',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/crossDomain': ''
        }
      },
      '/baiduTing': {
        target: 'http://tingapi.ting.baidu.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/baiduTing': ''
        }
      },
      '/baiduMic': {
        target: 'http://music.taihe.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/baiduMic': ''
        }
      },
      '/qukuLrc': {
        target: 'http://qukufile2.qianqian.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/qukuLrc': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html$|\.css/,
          threshold: 10240,
          deleteOriginalAssets: false
        })]
      }
    }
  }
}