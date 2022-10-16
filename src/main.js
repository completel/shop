import Vue from 'vue'
import App from './App.vue'
import router from '@/router'; // 引入路由
import store from '@/store';  // 引入vuex仓库
import * as API from '@/api'; // 统一接口api文件里面全部请求函数
import "@/mock/mockServe"; // 引入MockServer.js----mock数据
import "swiper/css/swiper.css" // 引入swiper样式
import TypeNav from "@/components/TypeNav"; // 三级联动组件--全局组件
import Carousel from "@/components/Carousel"; // 轮播图--全局组件
import Pagination from "@/components/Pagination"; // 分页器--全局组件
import { Button, MessageBox } from 'element-ui'; // 按需引入element-ui
import VueLazyload from "vue-lazyload";  // 引入懒加载插件
import huiyuan from "@/assets/images/1.gif";
import "@/plugins/validate"; // 引入表单校验插件

Vue.component(TypeNav.name, TypeNav);
Vue.component(Carousel.name, Carousel);
Vue.component(Pagination.name, Pagination);
Vue.component(Button.name, Button); // 1. 注册全局组件
Vue.prototype.$msgbox = MessageBox; // ElementUI注册组件的时候，还有一种写法，挂载原型上
Vue.prototype.$alert = MessageBox.alert;
Vue.use(VueLazyload, {
  // 懒加载默认的图片
  loading: huiyuan,
});


Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  // 注册路由信息：当这里书写router的时候，组件身上都拥有了$route和$router
  router,
  // 注册vuex：组件实例的身上会多个一个属性$store属性
  store,
  // 全局事件总线$bus
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },
}).$mount('#app')
