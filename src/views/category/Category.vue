<template>
  <div class="category">
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <tab-menu :categories="categories"
                @selectItem="selectItem"
                class="tab-menu"/>
      <scroll id="tab-content"
              ref="scoll"
              :data="[categoryData]">
        <tab-content-category :subcategories="showSubcategory"/>
        <tab-control :titles="['综合', '新品', '销量']"
                     @itemClick="tabClick"/>
        <good-list :goods="showCategoryDetail"/>
      </scroll>
    </div>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar";
  import Scroll from "@/components/common/scroll/Scroll";
  import TabMenu from "@/views/category/childComps/TabMenu";
  import TabContentCategory from "@/views/category/childComps/TabContentCategory";
  import TabContentDetail from "@/views/category/childComps/TabContentDetail";

  import {getCategory, getSubcategory, getCategoryDetail} from "@/network/category";
  import { tabControlMixin } from "@/common/mixin";
  import TabControl from "@/components/content/tabControl/TabControl";
  import GoodList from "@/components/content/goods/GoodsList";
  import { POP, SELL, NEW } from "@/common/const";

  export default {
    name: 'Category',
    components: {
      GoodList,
      TabControl,
      NavBar,
      Scroll,
      TabMenu,
      TabContentCategory,
      TabContentDetail
    },
    mixins: [tabControlMixin],
    data() {
      return {
        categories: [],
        categoryData: {

        },
        currentIndex: -1
      }
    },
    computed: {
      showSubcategory() {
        if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories;
      },
      showCategoryDetail() {
        if (this.currentIndex === -1) return []
        return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
    },
    created() {
      //1 请求分类数据
      this._getCategory();
      //2 监听图片加载完成
      this.$bus.$on('imgLoad', () => {
        this.$refs.scroll.refresh()
      })
    },
    methods: {
      //1 获取大类别数据
      _getCategory() {
        getCategory().then(res => {
          //1获取总体分类数据
          this.categories = res.data.category.list;
          //2初始化每个类别的子数据
          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 请求第一个分类的数据
          this._getSubcategories(0);
        })
      },
      //2 获取小类别数据
      _getSubcategories(index) {
        this.currentIndex = index;
        const maitKey = this.categories[index].maitKey;
        getSubcategory(maitKey).then(res => {
          this.categoryData[index].subcategories = res.data;
          this.categoryData = {...this.categoryData};
          this._getCategoryDetail(POP);
          this._getCategoryDetail(SELL);
          this._getCategoryDetail(NEW);
        })

      },
      //3 获取小类别下的分类数据
      _getCategoryDetail(type) {
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        //4 发送请求 传递对应的参数
        getCategoryDetail(miniWallkey, type).then(res => {
          //5 将获取的数据保留下来
          this.categoryData[this.currentIndex].categoryDetail[type] = res;
          this.categoryData = {...this.categoryData}
        })
      },
      //6 选择事件的选中
      selectItem(index) {
        // 点击选择大类别，传入index 进行小类别的查找 并返回数据
        this._getSubcategories(index);
      }
    }

  }
</script>

<style scoped>
#category {
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}

.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;

  display: flex;
}

#tab-content {
  height: 100%;
  flex: 1;
}
</style>
