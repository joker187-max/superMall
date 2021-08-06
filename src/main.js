import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";
import toast from "@/components/common/toast"
import VueLazyload from "vue-lazyload";

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue();
Vue.use(toast)
// 使用我们的懒加载组件 使用之后
Vue.use(VueLazyload, {
  // 图片未加载完之前显示什么
  loading: require('./assets/img/common/placeholder.png')
});
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
