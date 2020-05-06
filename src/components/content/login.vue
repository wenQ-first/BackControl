<template>
  <div id="login">
    <div class="login-box">
      <div class="top-img">
        <img src="@/assets/img/login/logo.png" alt />
      </div>
      <el-form
        :model="loginData"
        :rules="loginRules"
        ref="loginForm"
        :status-icon="true"
        label-width="0"
        class="form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginData.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginData.password"
            prefix-icon="el-icon-s-home"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="registClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginRequest } from "@/network/login.js";

export default {
  name: "login",
  data() {
    return {
      loginData: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, message: "请输入登录用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6到15个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    registClick() {
      this.$refs.loginForm.resetFields();
    },
    //登录请求判断是否成功请求
    loginClick() {
      this.$refs.loginForm.validate(flag => {
        if (flag) {
          loginRequest(this.loginData).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg);
            } else {
              window.sessionStorage.setItem("token", res.data.token);
              this.$router.push("/home");
              return this.$message.success("登录成功");
            }
          });
        } else {
          return;
        }
      });
    }
  }
};
</script>
<style scoped>
#login {
  height: 100%;
  background-color: #2b4b6b;
}
.login-box {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  transform: translate(-50%, -50%);
}
.top-img {
  position: absolute;
  left: 50%;
  width: 130px;
  height: 130px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  transform: translate(-50%, -50%);
}
.top-img > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.form {
  position: absolute;
  top: 100px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.btn {
  display: flex;
  margin-top: 30px;
  justify-content: flex-end;
}
</style>