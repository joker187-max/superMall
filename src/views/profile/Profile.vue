<template>
     <div id="profile">
       <nav-bar class="nav-bar"><div slot="center">我的主页</div></nav-bar>
         <user-info/>
         <account-info/>
         <normal-list-view :list-data="orderList"/>
         <normal-list-view :list-data="serviceList"/>
     </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar";
  import UserInfo from "@/views/profile/childComps/UserInfo";
  import AccountInfo from "@/views/profile/childComps/AccountInfo";
  import NormalListView from "@/views/profile/childComps/NormalListView";

  export default {
    name: "Profile",
    components: {
      NavBar,
      UserInfo,
      AccountInfo,
      NormalListView
    },
    data() {
      return {
        orderList: [
          {icon: 'message.svg', info: '我的消息'},
          {icon: 'pointer.svg', info: '积分商城'},
          {icon: 'vip.svg', info: '会员卡'},
        ],
        serviceList: [
          {icon: 'cart.svg', info: '我的购物车'},
          {icon: 'shopping.svg', info: '下载购物APP'},
        ]
      }
    }
  }
</script>

<style scoped>
  #profile {
    background-color: #f2f5f8;
  }
  .profile {
    position: absolute;
    height: calc(100% - 44px);
    width: 100%;
    top: 44px;
    left: 0;
    right: 0;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #ffffff;
  }
</style>
