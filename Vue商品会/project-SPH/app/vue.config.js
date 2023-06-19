const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap:false,
  transpileDependencies: true,
  // 用来提示语法错误的
  lintOnSave:false,

  // 代理跨域
  devServer: {
    proxy: {
      '/api': {
        target:'http://gmall-h5-api.atguigu.cn',
      }
    }
  }
})
