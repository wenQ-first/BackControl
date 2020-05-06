<template>
  <div id="powerList">
    <bread-crumb :itemData="navTitle"></bread-crumb>

    <!-- 权限列表 -->
    <el-card class="box-card">
      <!-- 表格 --权限列表渲染-->
      <el-table :data="tableData" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
        <el-table-column label="路径" prop="path" align="center"></el-table-column>
        <el-table-column label="权限等级" prop="level" align="center">
          <template slot-scope="s">
            <el-tag v-if="s.row.level == 0">一级</el-tag>
            <el-tag v-else-if="s.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else-if="s.row.level == 2" type="danger">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from "@/components/content/mianbaoxie/BreadCrumb";

//导入网络请求相关方方法
import { getPowerListInfo } from "@/network/powerList";
export default {
  name: "PowerList",
  data() {
    return {
      navTitle: ["权限管理", "权限列表"], //头部面包屑的实参
      tableData: [] //表格内数据显示
    };
  },
  components: {
    BreadCrumb
  },
  created() {
    getPowerListInfo().then(res => {
      this.tableData = res.data;
    });
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