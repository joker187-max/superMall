<template>
  <div class="goods-item" @click="itemClick">
    <img v-lazy="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    //接受 父组件 遍历出来的 数组中的对象数据
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    showImage() {
      // 当前者不为空时,就返回前者 否则就返回后者
      return this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
    }
  },
  methods: {
    // 1 @load 方法监听图片的加载情况 图片一旦加载 就会触发这个函数
    //我们在 监听函数中 改变scroll的 滚动情况 使用事件总线 来发射 信号
    //事件总线 主要用于事件管理 vuex用于状态管理
    //$bus 要使用原型 进行注册创建出一个Vue实例 用此示例进行 数据总线事件的发送和 监听
    imageLoad() {
      this.$bus.$emit('itemImageLoad')
    },
    // 2 详情页的跳转逻辑 点击每一个商品展示item 就会进入相应的商品详情页 携带数据id
    itemClick() {
      this.$router.push('/detail/' + this.goodsItem.iid)
    }

  }
}
</script>

<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;
    width: 48%;
  }
  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }
  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }
  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }
  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }
  .goods-info .collect {
    position: relative;
  }
  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url(~assets/img/common/collect.svg) 0 0/14px 14px;
  }
</style>
