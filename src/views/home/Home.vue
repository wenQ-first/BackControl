<template>
  <div id="home">
    <el-button type="info" @click="backClick">退出</el-button>
  </div>
</template>
  
<script>
export default {
  name: "Home",
  methods: {
    backClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style scoped>
</style>