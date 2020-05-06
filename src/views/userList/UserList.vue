<template>
  <div id="userList">
    <bread-crumb></bread-crumb>
    <box-card
      :usersInfo="usersInfo"
      :queryInfo="queryInfo"
      :total="total"
      @getClick="getUserClick"
      @addGetUser="getUserClick"
      @handleChang="handleChang"
      @changSize="changSize"
      @updateUser="getUserClick"
      @removeUser="getUserClick"
      @changRole="getUserClick"
    ></box-card>
  </div>
</template>

<script>
import BreadCrumb from "./childrenCom/BreadCrumb";
import BoxCard from "./childrenCom/BoxCard";

import usersRequest from "@/network/users";

export default {
  name: "UserList",
  data() {
    return {
      queryInfo: {
        //请求用户数据的参数
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      usersInfo: [], //用户列表具体数据
      total: 0 // 用户总数
    };
  },
  components: {
    BreadCrumb,
    BoxCard
  },
  created() {
    //请求用户列表相关数据
    usersRequest(this.queryInfo).then(res => {
      this.usersInfo = res.data.users;
      this.total = res.data.total;
    });
  },
  methods: {
    //获取用户列表或者查询用户列表
    getUserClick(query) {
      this.queryInfo.query = query;
      usersRequest(this.queryInfo).then(res => {
        this.usersInfo = res.data.users;
        this.total = res.data.total;
      });
    },
    //改变页码数字处理函数
    handleChang(newPage) {
      this.queryInfo.pagenum = newPage;
      usersRequest(this.queryInfo).then(res => {
        this.usersInfo = res.data.users;
      });
    },
    //改变页面记录数据数量显示条数
    changSize(newPage) {
      this.queryInfo.pagesize = newPage;
      usersRequest(this.queryInfo).then(res => {
        this.usersInfo = res.data.users;
      });
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