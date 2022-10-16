<template>
  <div>
    <Headers></Headers>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <!-- 在Home、Search显示，在登录、注册隐藏 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Headers from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: "App",
  data() {
    return {
      msg: "abc",
    };
  },
  components: {
    Headers,
    Footer,
  },
  mounted() {
    // 通知Vuex发请求，获取数据，存储与仓库当中
    // 派发一个action||获取商品分类的三级列表数据
    this.$store.dispatch("categoreList");
  },
};
</script>

<style>
</style>
