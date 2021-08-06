<template>
  <div class="bottom-bar">
    <check-button class="select-all"
                  :is-checked="isSelectAll"
                  @click.native="checkClick"/>
    <span>全选</span>
    <span class="total-price">合计: ¥{{totalPrice}}</span>
    <span class="buy-product" @click="calcClick">去结算({{cartLength}})</span>
  </div>
</template>

<script>
import CheckButton from "@/views/cart/childComps/CheckButton";
import { mapGetters } from 'vuex'
export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters([
      'cartList',
      'cartLength'
    ]),
    totalPrice() {
      return this.cartList.filter(item => {
        // 过滤那些选中的 项目
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count;
      },0).toFixed(2)
    },
    isSelectAll() {
      // 找到一个不为空的则错误
      if (this.cartList.length === 0) return false;
      return !this.cartList.find(item => item.checked === false);
    }
  },
  methods: {
    checkClick() {
      // 如果之前是全部选中 则点击过后 全部变为false
      if (this.isSelectAll) {
        this.cartList.forEach(item => item.checked = false);
      } else {
        this.cartList.forEach(item => item.checked = true);
      }
    },
    calcClick() {
      //如果一件商品都没选中
      if (!this.isSelectAll) {
        this.$toast.show('您未选中商品!', 1500);
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar{
  height: 44px;
  width: 100%;
  background-color: #eee;
  position: fixed;
  bottom: 49px;
  left: 0;
  font-size: 14px;
  color: #888;
  padding-left: 35px;
  line-height: 44px;
  box-sizing: border-box;
}
.bottom-bar .select-all {
  position: absolute;
  line-height: 0;
  left: 12px;
  top: 13px;
}

  .total-price {
    margin-left: 15px;
    font-size: 16px;
    color: #666;
  }
  .buy-product {
    background-color: orangered;
    color: #fff;
    width: 100px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    float: right;
  }
</style>
