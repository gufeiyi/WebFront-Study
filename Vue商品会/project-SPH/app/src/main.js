import Vue from 'vue';
import App from './App.vue';

// 三级联动的组件（全局组件）
// 引入并注册
import TypeNav from '@/components/TypeNav';
Vue.component(TypeNav.name,TypeNav);

// 引入全局组件Carousel
import Carousel from '@/components/Carousel';
Vue.component(Carousel.name,Carousel);

// 引入全局组件分页器
import Pagination from '@/components/Pagination';
Vue.component(Pagination.name,Pagination);

// 按需引入element-ui的button组件
import { Button,MessageBox } from 'element-ui';
Vue.component(Button.name,Button);

// 在Vue原型上面绑MessageBox
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 引入路由
import router from './router';

// 测试api配置好使不好使
// 请求了api才会有那个nprogress的样式
// import {reqCategoryList} from '@/api';
// reqCategoryList();

// 引入仓库
import store from '@/store';

// 引入mockServe.js
import '@/mock/mockServe';

// 引入swiper样式
import "swiper/swiper-bundle.min.css"

// 接下来是不用vuex的通过接口调用数据的方式
// 统一接收api文件夹里面全部请求函数
import * as API from '@/api'
import VueLazyload from 'vue-lazyload';
// 引入懒加载的图片
import girl from '@/assets/1.gif';
// 懒加载注册插件
Vue.use(VueLazyload,{
  loading:girl,
});

// 引入表单校验插件
import '@/plugins/validate';
new Vue({
  render: h => h(App),
  // 全局事件总线的配置
  beforeCreate(){
    Vue.prototype.$bus = this;
    // 往原型上放API，使得所有的组件都可以用这些接口
    Vue.prototype.$API = API;
  },
  // 注册路由
  // 使得组件身上都拥有$route,$router
  router,
  // 注册仓库
  // 使得组件实例的身上会多一个属性$store
  store
}).$mount('#app')
