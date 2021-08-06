<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :goods-item="item"/>
  </div>
</template>

<script>
import GoodsListItem from "@/components/content/goods/GoodsListItem";
export default {
  name: "GoodList",
  components: {
    GoodsListItem
  },
  props: {
    goods: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
  .goods {
    display: flex;
    /*设置 flex布局换行 装不下不在一行显示*/
    flex-wrap: wrap;
    /*设置 弹性项目 在主轴上的 排列方式 space-around 会将元素放入 且 左右两边预留相同的空格*/
    justify-content: space-around;
    padding: 2px;
  }
</style>
