module.exports = {
  // 修改 src 目录 为 examples 目录
  pages: {
    index: {
      entry: 'examples/main.ts',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add('/packages')
      .add('/packages1')
      .add('/example')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
  },
  // configureWebpack: {
  //   externals: {
  //     testIndex: {
  //       commonjs: "testIndex",//如果我们的库运行在Node.js环境中，import _ from 'lodash'等价于const _ = require('lodash')
  //       commonjs2: "testIndex",//同上
  //       amd: "testIndex",//如果我们的库使用require.js等加载,等价于 define(["lodash"], factory);
  //       root: "testIndex"//如果我们的库在浏览器中使用，需要提供一个全局的变量‘_’，等价于 var _ = (window._) or (_);
  //     }
  //   }
  // },
}
