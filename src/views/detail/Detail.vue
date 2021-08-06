<template>
  <div class="detail">
    <detail-nav-bar @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goodsInfo"/>
      <detail-shop-info :shop="shopInfo"/>
      <detail-image-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
      <detail-params-info :param-info="itemParams" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
  import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
  import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
  import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
  import DetailImageInfo from "@/views/detail/childComps/DetailImageInfo";
  import DetailParamsInfo from "@/views/detail/childComps/DetailParamsInfo";
  import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
  import GoodsList from "@/components/content/goods/GoodsList";
  import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";
  import Toast from "@/components/common/toast/Toast";
  import {itemListenerMixin, backTopMixin}from '@/common/mixin'

  import Scroll from "@/components/common/scroll/Scroll";
  import {getDetail, Goods, getRecommend} from "@/network/detail";
  import { mapActions } from 'vuex'
  import { debounce } from "@/common/utils";

  export default {
    name: "Detail",
    components: {
      Scroll,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailImageInfo,
      DetailParamsInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList
    },
    methods: {
      ...mapActions([
        'addCart'
      ]),
      // 详情页头部点击事件 页面滚动到对应的位置
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500);
      },
      // 详情页滚动 触发函数
      contentScroll(position) {
        // 1获取y值
        const y = -position.y;
        let length = this.themeTopYs.length;
        for (let i = 0; i < length - 1; i++) {
          if (this.currentIndex !== i && (y >= this.themeTopYs[i] && y < this.themeTopYs[i+1])) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }
        // scroll滚动 判断是否显示返回顶部标记
        this.isShowBackTop = -position.y > 1500;
      },
      // 当图片全部加载完成后 完成各组件offset的准确赋值 并使用防抖提升性能
      detailImageLoad() {
        this.getThemeTopY();
      },
      // 将详情页的 商品数据信息加入到购物车中去
      addToCart() {
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goodsInfo.title;
        product.desc = this.goodsInfo.desc;
        product.price = this.goodsInfo.realPrice;
        product.iid = this.iid;

        //调用mutation中的方法修改state中的数据 既将商品对象加入数组中
        // 调用mapActions 将方法引入进来 调用PromiseAPI使处理更加优雅
        this.addCart(product).then(res => {
          //点击之后 让面包屑显示
          this.$toast.show(res, 1500)
        })

      }
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goodsInfo: {},
        shopInfo: {},   // 商店详细信息
        detailInfo: {}, // 商品详情信息
        itemParams: {}, // 商品参数信息
        commentInfo: {}, // 商品评论数据
        recommends: [],  //商品推荐信息
        themeTopYs: [], //各组件的offsetTop值
        getThemeTopY: null,
        currentIndex: 0 //当前的下标
      }
    },
    created() {
      //1 保存输入的id
      this.iid = this.$route.params.iid
      //2 根据iid 请求商品详情数据
      getDetail(this.iid).then(res => {
        // 获取顶部的轮播图
        const data = res.result;
        this.topImages = data.itemInfo.topImages;

        // 3 创建商品的对象
        this.goodsInfo = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
        // 4 取出店铺信息的相关数据
        this.shopInfo = data.shopInfo
        // 5 取出详情的信息
        this.detailInfo = data.detailInfo
        // 6 取出我们参数的信息
        this.itemParams = data.itemParams
        // 7 取出评论的消息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
      })
      //3 请求推荐商品数据 直接引入goodList组件，将数据作为props传入展示
      getRecommend().then(res => {
        this.recommends = res.data.list;
      })
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
        this.themeTopYs.push(Number.MAX_VALUE);
      }, 200)
    },
    mounted() {

    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  .detail {
    height: 100vh;
    background-color: #ffffff;
    position: relative;
    z-index: 1;
  }
  .content {
    background-color: #ffffff;
    height: calc(100% - 44px - 58px);
  }
</style>
