<template>
  <div id="app">
    <Header></Header>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <!-- 底部的组件，在home和search组件中是显示的，在登录和注册组件中是隐藏的 -->
    <!-- 第一种方法：可以，但不推荐，因为如果展示的组件太多写的代码过于冗杂 -->
    <!-- <Footer v-show="$route.path=='/home' || $route.path=='/search'"></Footer> -->

    <Footer v-show="$route.meta.showFooter"></Footer>
  </div>
</template>

<script>
// 引入组件
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  mounted() {
    // 通知vuex，获取商品分类的列表 
    // 请求只发一次，不能放到main.js里面，因为this是undefined
    this.$store.dispatch("categoryList");
  },
};
</script>

<style>
</style>
