<template>
  <div id="home">
    <el-container>
      <el-header>
        <div class="l-img">
          <img src="@/assets/img/home/top.png" alt />
          电商后台管理系统
        </div>
        <el-button type="info" @click="backClick" class="btn-back">退出</el-button>
      </el-header>
      <el-container>
        <home-aside :menuData="menuData" class="home-aside"></home-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
  
<script>
import HomeAside from "./chilidCom/Aside";

// 导入封装好的axios
import homeRequest from "@/network/home";

export default {
  name: "Home",
  components: {
    HomeAside
  },
  data() {
    return {
      menuData: []
    };
  },
  methods: {
    backClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  },
  created() {
    console.log("sadasd");
    homeRequest().then(res => {
      this.menuData = res.data;
    });
  }
};
</script>
<style scoped>
#home {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  padding-left: 0;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  color: #fff;
  text-align: center;
}

.el-aside {
  background-color: #333744;
  color: #fff;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.l-img {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 18px;
}
.l-img img {
  width: 60px;
  height: 100%;
  margin-right: 15px;
}
.home-aside {
  overflow: hidden;
}
</style>