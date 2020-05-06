<template>
  <el-aside :width="flag ? '64px' : '200px'">
    <div class="asdie-top" @click="topClick">|||</div>
    <el-menu
      router
      :default-active="path"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="flag"
      :collapse-transition="false"
      class="menu"
    >
      <el-submenu :index="item.path + ''" v-for="(item,index) in menuData" :key="item.id">
        <template slot="title">
          <i :class="classMenu[index]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="i.path + ''" v-for="i in item.children" :key="i.id" class="menu-item">
          <i class="el-icon-menu"></i>
          <span>{{i.authName}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "Aside",
  props: {
    //左边侧边栏的数据
    menuData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    //判断默认高亮的Nav侧边栏
    path() {
      let p = this.$route.path;
      p = p.slice(1);

      //添加商品页面增加后，无法判断goods选项的高亮,必须进行此判断
      if (p == "add") {
        p = "goods";
      }
      return p;
    }
  },
  data() {
    return {
      classMenu: [
        //图标类名
        "el-icon-s-custom",
        "el-icon-s-order",
        "el-icon-s-goods",
        "el-icon-s-claim",
        "el-icon-magic-stick"
      ],
      flag: false //切换菜单的折叠与展开
    };
  },
  methods: {
    //判断是否展开和收缩--导航项
    topClick() {
      this.flag = !this.flag;
    }
  }
};
</script>

<style scoped>
el-menu-item,
el-submenu {
  padding: 0;
}
.menu {
  width: 200px;
  text-align: left;
}
.menu-item {
  text-align: center;
}
.asdie-top {
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  background-color: #4a5064;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>