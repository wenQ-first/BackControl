<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item,index) in itemData" :key="index">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "BreadCrumb",
  props: {
    //面包屑的标题文字s
    itemData: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
<style scoped>
</style>