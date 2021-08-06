import Toast from "@/components/common/toast/Toast";
const obj = {};

//Vue.use 会调用组件的install方法
obj.install = function (Vue) {
  //1 创建组件构造器
  const toastContrustor = Vue.extend(Toast);
  //2 创建组件实例
  const toast = new toastContrustor();
  //3 将对象手动挂载到一个元素上
  toast.$mount(document.createElement('div'))
  //4 toast.$el对应的就是div 挂栽倒全局对象上
  document.body.appendChild(toast.$el)
  Vue.prototype.$toast = toast;
}

export default obj
