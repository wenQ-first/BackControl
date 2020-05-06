<template>
  <el-card class="box-card">
    <!-- 表格 --用户列表渲染-->
    <el-table :data="usersInfo" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column
        align="center"
        v-for="(item,index) in showLabel"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      ></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "CardTable",
  props: {
    usersInfo: {
      //这个表格要展示的数据总头
      type: Array,
      default() {
        return [];
      }
    },
    showLabel: {
      /* 类似数据--应传 let arr = [{
        label:'姓名',  //每列字段名
        prop:'username' //每列字段对应数据
        }] */
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
<style scoped>
.box-card {
  margin-top: 20px;
  scroll-margin-bottom: 15px;
  text-align: left;
  line-height: 24px;
}
</style>