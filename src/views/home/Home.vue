<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="titles"
                 class="tab-control"
                 v-show="isTabFixed"
                 @tabClick="tabClick"
                 ref="tabControl1"
    />
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="ContentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"
                   @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="titles"
                   @tabClick="tabClick"
                   ref="tabControl2"
                   />
      <good-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar";
  import TabControl from "@/components/content/tabControl/TabControl";
  import GoodList from "@/components/content/goods/GoodsList";
  import Scroll from "@/components/common/scroll/Scroll";

  import HomeSwiper from "@/views/home/childComps/HomeSwiper";
  import RecommendView from "@/views/home/childComps/RecommendView";
  import FeatureView from "@/views/home/childComps/FeatureView";

  import {getHomeMultidata, getHomeGoods} from "@/network/home";
  import {debounce} from "@/common/utils";
  import {itemListenerMixin, backTopMixin} from "@/common/mixin";

  export default {
    name: "Home",
    components: {
      GoodList,
      FeatureView,
      NavBar,
      HomeSwiper,
      RecommendView,
      TabControl,
      Scroll
    },
    computed: {
      //使用 计算属性 使得结果更加简洁
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        titles: ['流行', '新款', '精选'], //tab栏 title取值
        // 首页数据的存储
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },  //商品数据信息
        currentType: 'pop', //当前数据类型
        tabOffsetTop: 0, // tab栏与顶部的距离
        isTabFixed: false,  //Tab 栏是否吸顶 默认false
        saveY: 0, //
      }
    },
    //通过生命周期函数来发送网络请求
    //具体 逻辑代码建议放在 methods下 created 中 仅仅做一个调用即可
    created() {
      // 1 请求广告数据
      this.getHomeMulti()
      // 2 请求商品数据
      this.getHomeGood('pop')
      this.getHomeGood('new')
      this.getHomeGood('sell')
    },
    mounted() {
      console.log('homemounted')
    },
    destroyed() {
      console.log("Home 组件被销毁了")
    },
    // 被缓存组件的 处于活跃状态时被激活
    activated() {
      // 首先要刷新 解决了一个bug
      this.$refs.scroll.refresh();
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
    },
    // 被缓存的组件 处于不活跃状态激活
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY();
      //取消全局事件的绑定
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {

      /*
      一 事件监听相关
      */
      // 1 tab栏切换 更换请求数据类型
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        // 保持两个tabControl的 活跃Index 一致
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      // 2 轮播图加载监听 加载后获取正确的offsetTop
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },

      /*
       二 网络请求 相关
       */
      // 1 请求多个数据
      getHomeMulti() {
        // 1 请求多个数据
        getHomeMultidata().then(res => {
          // 请求网络数据 完成后 将 获取的数据一定保存到 定义的变量里
          // 这样才能保存数据
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      // 2 请求商品数据
      getHomeGood(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          // 数组的解构 赋值 遍历 并将其加入到 list当中 使用扩展运算符 ...
          // 加载完一页的内容后 继续将page数据加一 以便下次 直接获取下一页的内容
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;
          // 继续完成 上拉加载更多 否则只能 完成一次上拉 加载动作
          this.$refs.scroll.finishPullUp()
        })
      },
      // 3 上拉加载更多数据
      loadMore() {
        this.getHomeGood(this.currentType);
      },

      /*
      三 页面操作 有关 控制
      Vue.native修饰符 可以监听原生html的事件 设置为组件的根元素
       */
      // 2 Scorll组件 监听页面滚动
      ContentScroll(position) {
        // position 的值 都为负数 需要取反
        this.isShowBackTop = (-position.y) > 1000;
        // 当页面滚动的位置大于 tab栏与顶部的 距离后 tab栏完成吸顶效果
        // 我们设置两个tabControl 滚动距离在阈值之下时 我们显示原来的
        // 当滚动距离超过阈值后 就将固定吸顶效果的tabcontrol 显示
        this.isTabFixed = (-position.y) > this.tabOffsetTop;
      }


    }

  }
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #f6f6f6;
  }
  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    top: -1px;
    z-index: 9;
  }

</style>
