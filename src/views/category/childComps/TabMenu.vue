<template>
  <div class="cate">
    <scroll id="tab-menu" ref="scroll">
      <div class="menu-list">
        <div class="menu-list-item"
             v-for="(item, index) in categories"
             :class="{active: index === currentIndex}"
             :key="index"
             @click="itemClick(index)">
          {{item.title}}
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll";
export default {
  name: "TabMenu",
  components: {
    Scroll
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  props: {
    categories: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      this.$emit('selectItem', index);
    }
  },
  activated() {
    // 当购物车组件处于活跃状态时 重新计算
    this.$refs.scroll.refresh();
  }

}
</script>

<style scoped>
/*确定好滚动条的位置*/
#tab-menu {
  background-color: #f6f6f6;
  height: 100%;
  width: 100px;
  box-sizing: border-box;
}

.menu-list-item {
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 14px;
}

.menu-list-item.active {
  font-weight: 700;
  color: var(--color-high-text);
  background-color: #fff;
  border-left: 3px solid var(--color-high-text);
}
</style>
