<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    data() {
      return {
        scroll: null
      }
    },
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default() {
          return []
        }
      }

    },
    mounted() {
      // 1 将 创建的 插件对象 赋给我们的 data 持久化保存
      this.scroll = new BScroll(this.$refs.wrapper, {
        // 是否截流监听页面的 滚动  scroll 事件 不能写死 根据需要 props传入参数
        probeType: this.probeType,
        // 高版本的 better scroller 需要添加 observeDOM ：true vue 组件才可以滚动
        observeDOM: true,
        // better-scroll 会阻止原生的click 事件失效 设为true 便可以 点击了
        click: true,
        // 监听组件的上拉动作事件 一样与我们组件内的props 绑定 根据父组件内的值动态 传入
        pullUpLoad: this.pullUpLoad
      })
      // 2 通过 我们创建出来的 better-scroll实例  进行监听页面的滚动
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          this.$emit('scroll', position);
        })
      }
      // 3 监听Scroll 滚动到底部
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      // es6的新特性 给参数传入一个 默认参数
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo(x, y, time);
      },
      // 确保 一个 上拉动作已完成 可以继续监听下一个 下拉动作 调用 scroll实例的 完成上拉动作方法
      finishPullUp() {
        this.scroll.finishPullUp();
      },
      //刷新 scroll属性的方法 可以及时的更新 防止无法滚动的情况
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      // 获取当前Scroll组件滚动的距离,以便记录离开组件时的状态,给用户良好的体验
      getScrollY() {
        return this.scroll ? this.scroll.y : 0;
      }
    }
}
</script>

<style scoped>
  .wrapper {
    overflow: hidden;
}
</style>
