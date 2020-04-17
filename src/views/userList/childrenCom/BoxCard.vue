<template>
  <el-card class="box-card">
    <!-- 头部搜索栏 -- 添加用户按钮 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="text item">
          <el-input placeholder="请输入内容" v-model="changeQuery" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getClick"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 --用户列表渲染-->
    <el-table :data="usersInfo" border stripe class="userTable">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" prop="mg_state">
        <template slot-scope="s">
          <el-switch v-model="s.row.mg_state" @change="siwtchClick(s.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="s">
          <el-tooltip class="item" effect="dark" content="修改信息" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="editClick(s.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除信息" placement="top">
            <el-button type="danger" icon="el-icon-delete" @click="removeClick(s.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="warning" icon="el-icon-setting"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码--页数 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--   添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeForm">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserBtn">确 定</el-button>
      </span>
    </el-dialog>

    <!--   修改用户弹窗 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editFormData" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editFormData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editForm">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import usersRequest from "@/network/users";
import { stateRequest } from "@/network/state";
import { addRequest } from "@/network/homepage";
import { editRequest, editUserInfo, removeUserInfo } from "@/network/homepage";

export default {
  name: "BoxCard",
  data() {
    //邮箱的校验规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };

    //手机号的校验规则
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };

    return {
      dialogVisible: false, // 添加用户--对话框的显示与隐藏
      ruleForm: {
        //添加用户表单信息
        username: "asd",
        password: "sadasdasd",
        email: "1436454@qq.com",
        mobile: "13874125462"
      },
      rules: {
        //用户规则
        username: [
          { required: true, message: "请输入登录用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6到15个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      changeQuery: "", //搜索表单绑定的值
      editDialogVisible: false, //修改用户--信息弹窗的显示与隐藏
      editFormRules: {
        //修改用户--信息弹窗规则
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editFormData: {
        //修改用户--表单信息
        username: "",
        email: "",
        mobile: ""
      },
      editId: "" //保存具体id值
    };
  },
  props: {
    usersInfo: {
      //用户列表信息
      type: Array,
      default() {
        return [];
      }
    },
    queryInfo: {}, // 用户列表请求参数
    total: 0 //总记录数
  },
  methods: {
    //监听页面记录数量--page-sizes改变的时候触发
    handleSizeChange(newPage) {
      this.$emit("changSize", newPage);
    },
    //监听页码数字
    handleCurrentChange(newPage) {
      this.$emit("handleChang", newPage);
    },
    //监听siwtch开关的改变
    siwtchClick(payload) {
      stateRequest(payload.id, payload.mg_state)
        .then(res => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
          } else {
            this.$message.success("状态更新成功");
          }
        })
        .catch(err => {
          this.$message.error("状态更新失败");
        });
    },
    //监听搜索点击事件
    getClick() {
      this.$emit("getClick", this.changeQuery);
      //改变query的值
    },
    //监听表单关闭事件
    closeForm() {
      this.$refs.ruleForm.resetFields();
    },
    //监听添加用户确定按钮的点击事件
    addUserBtn() {
      this.$refs.ruleForm.validate(flag => {
        if (flag) {
          addRequest(this.ruleForm)
            .then(res => {
              console.log(res);
              if (res.meta.status != 201) {
                this.$message.error(res.meta.msg);
              } else {
                this.$message.success("添加用户成功");
              }
              this.$emit("addGetUser");
              this.dialogVisible = false;
            })
            .catch(err => {
              this.$message.success("添加用户失败");
            });
        } else {
          this.dialogVisible = true;
        }
      });
    },
    //监听修改用户信息按钮的点击
    editClick(id) {
      this.editId = id;
      // 点击修改用户信息按钮----获取一开始显示用户的信息
      this.editDialogVisible = true;

      //因为请求操作时异步的，所以最好先把数据清空一下，以免下次点击有一瞬间会显示上次点击查看用户的信息
      this.editFormData = {};

      // 获取一开始显示用户原来的信息 --修改用户信息
      editRequest(id).then(res => {
        this.editFormData = res.data;
      });
    },
    //监听修改用户信息弹窗的确定按钮
    editForm() {
      this.$refs.editFormRef.validate(flag => {
        if (flag) {
          let payload = {};
          payload.id = this.editId;
          payload.data = {
            email: this.editFormData.email,
            mobile: this.editFormData.mobile
          };
          editUserInfo(payload).then(res => {
            if (res.meta.status !== 200) {
              this.$message.error("更新用户信息失败");
            } else {
              this.editDialogVisible = false;
              this.$emit("updateUser");
              this.$message.success("更新用户信息成功");
            }
          });
        } else {
          return;
        }
      });
    },
    //监听删除用户的按钮点击事件
    removeClick(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          removeUserInfo(id).then(res => {
            this.$message.success("成功删除用户");
            this.$emit("removeUser");
          });
        })
        .catch(err => {
          return this.$message.warning("取消用户删除");
        });
    }
  }
};
</script>
<style scoped>
.userTable {
  margin-top: 15px;
}
el-pagination {
  margin-top: 30px;
}
</style>