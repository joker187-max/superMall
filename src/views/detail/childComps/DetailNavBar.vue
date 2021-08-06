<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="../../../assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item, index) in titles"
             class="title-item"
             :class="{active: index === currentIndex}"
             @click="titleClick(index)">
          {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
export default {
  name: "DetailNavBar",
  components: {
    NavBar
  },
  data() {
    return {
      titles: ['商品', '参数', '评论', '推荐'],
      currentIndex: 0
    }
  },
  methods: {
    // 标题点击切换
    titleClick(index) {
      this.currentIndex = index;
      this.$emit('titleClick', index);
    },
    // 返回按钮返回
    backClick() {
      //回退到上一级
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
  .nav-bar {
    position: relative;
    z-index: 9 ;
  }
  .nav-bar img {
    margin-top: 10px;
  }
  .title {
    display: flex;
    font-size: 10px;
    padding: 0 10px;
  }

  .title-item {
    flex: 1;
  }
  .active {
    color: var(--color-high-text);
  }
  .back {
    margin-top: 2px;
  }
</style>
