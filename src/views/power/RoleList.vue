<template>
  <div id="roleList">
    <bread-crumb :itemData="breadTitle"></bread-crumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 表格渲染区域 -->
      <el-table :data="roleData" border stripe class="role-table">
        <el-table-column type="expand">
          <!-- 表格扩展部分渲染 -->
          <template slot-scope="data">
            <el-row
              :class="['tag-bottom',index ==0 ? 'tag-top':'','flex-center']"
              v-for="(item1,index) in data.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  class="role-tag"
                  closable
                  @close="closeTag(data.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 先渲染二级权限在渲染三级权限 -->
                <el-row
                  v-for="(item2,index) in item1.children"
                  :key="item2.id"
                  :class="[index ==0 ? '':'tag-top','flex-center'] "
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTag(data.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3,index) in item2.children"
                      :key="item3.id"
                      @close="closeTag(data.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="data">
            <el-tooltip class="item" effect="dark" content="编辑角色" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editClick(data.row)"
              >编辑</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deletRoleClick(data.row.id)"
              >删除</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="allocationClick(data.row)"
              >分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--  添加角色弹窗 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="30%" @close="closeForm">
      <el-form ref="form" :model="addRoleData" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="addRoleData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色详情">
          <el-input v-model="addRoleData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色信息弹窗 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%" @close="editClose">
      <span>
        <el-form ref="eidtForm" :model="addRoleData" label-width="80px">
          <el-form-item label="角色名称">
            <el-input :disabled="true" v-model="addRoleData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色详情">
            <el-input v-model="addRoleData.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canleClick">取 消</el-button>
        <el-button type="primary" @click="yesClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分配权限弹窗 -->
    <el-dialog title="分配权限" :visible.sync="roleFlag" width="30%">
      <!-- 树形控件 -->
      <el-tree
        node-key="id"
        ref="treeRef"
        :default-checked-keys="checkRoleData"
        default-expand-all
        show-checkbox
        :data="allocationData"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleFlag = false">取 消</el-button>
        <el-button type="primary" @click="roleFlagClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/content/mianbaoxie/BreadCrumb";
import {
  getRoleListInfo,
  deleteRoleListInfo,
  addRoleList,
  editRoleInfo,
  editRolesData,
  removeRoleTag,
  getTreeRoleData,
  sendTreeRoleData
} from "@/network/powerList";

export default {
  name: "RoleList",
  data() {
    return {
      breadTitle: ["权限管理", "角色列表"], //头部面包屑内容实参
      roleData: [], //角色列表信息
      addRoleData: {
        roleName: "",
        roleDesc: ""
      }, //添加角色信息
      dialogVisible: false, //添加角色弹窗的flag
      editDialogVisible: false, // 修改角色信息显示弹窗的flag
      lastInfo: {}, //记录原来的修改橘色信息
      roleFlag: false, // 分配权限弹窗flag
      allocationData: [], //分配权限的数据
      defaultProps: {
        label: "authName",
        children: "children"
      }, // 树形控件绑定的label 和 结构数据的 prop
      checkRoleData: [], //树形控件默认勾选的数据 id
      roleId: 0 //保存角色的id
    };
  },
  components: {
    BreadCrumb
  },
  created() {
    getRoleListInfo().then(res => {
      if (res.meta.status !== 200) {
        this.$message.error("获取角色列表信息失败");
      } else {
        this.roleData = res.data;
      }
    });
  },
  methods: {
    //删除按钮点击事件监听处理
    deletRoleClick(payload) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          //发送删除角色的请求
          deleteRoleListInfo(payload).then(res => {
            //获取角色列表信息
            getRoleListInfo().then(res => {
              this.roleData = res.data;
            });
          });
        })
        .catch(err => {
          this.$message.warning("取消删除角色操作");
        });
      //deleteRoleListInfo(payload);
    },
    //关闭表单事件监听处理
    closeForm() {
      this.addRoleData = {};
    },
    //确定添加角色处理
    confirmClick() {
      //添加角色请求处理
      addRoleList(this.addRoleData)
        .then(res => {
          this.dialogVisible = false;
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg);
          } else {
            this.$message.success("添加角色成功");
            //添加角色成功以后，返回一个请求角色列表数据的promise---
            return getRoleListInfo();
          }
        })
        .then(res => {
          //处理的是请求角色列表的promise
          this.roleData = res.data;
        });
    },
    //修改角色按钮点击监听
    editClick(data) {
      this.editDialogVisible = true;
      this.addRoleData = data;
      this.lastInfo = data;
    },
    //关闭修改角色弹窗监听
    editClose() {
      this.addRoleData = {};
    },
    //修改角色弹窗中确定按钮点击
    yesClick() {
      const self = this;
      const payload = {
        id: self.addRoleData.id,
        data: {
          roleName: self.addRoleData.roleName,
          roleDesc: self.addRoleData.roleDesc
        }
      };
      editRolesData(payload).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.editDialogVisible = false;
          this.$message.success("修改角色详情成功");
          getRoleListInfo().then(res => {
            this.roleData = res.data;
          });
        }
      });
    },
    //修改橘色弹窗中取消按钮点击
    canleClick() {
      this.editDialogVisible = false;
    },
    //删除对应的标签权限
    closeTag(obj, tagId) {
      const payload = {
        id: obj.id,
        tagId
      };
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          return removeRoleTag(payload);
        })
        .then(res => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
          } else {
            this.$message.success("删除权限成功");
            obj.children = res.data;
          }
        })
        .catch(err => {
          this.$message.warning("取消删除成功");
        });
    },
    //分配权限按钮点击事件监听
    allocationClick(data) {
      this.roleId = data.id;
      this.checkRoleData = []; //每次点击之前 要先清空之前的check数据--所以要清空这个数组
      this.getLeafKeys(data, this.checkRoleData);
      this.roleFlag = true;
      getTreeRoleData().then(res => {
        this.allocationData = res.data;
      });
    },
    //分配权限弹窗里面的确定按钮点击
    roleFlagClick() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const keysStr = keys.join(","); //请求参数是要以逗号接连所以要进行数组拼接
      sendTreeRoleData(this.roleId, keysStr).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.roleFlag = false;
          this.$message.success("更新角色权限成功");
          return this.getUserInfo();
        }
      });
    },
    // 递归方法 遍历出三级权限节点
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      } else {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr);
        });
      }
    },
    //重复操作 获取角色信息
    getUserInfo() {
      getRoleListInfo().then(res => {
        if (res.meta.status !== 200) {
          this.$message.error("获取角色列表信息失败");
        } else {
          this.roleData = res.data;
        }
      });
    }
  }
};
</script>
<style scoped>
.role-table {
  margin-top: 20px;
}
.el-tag {
  margin: 7px;
}
.tag-bottom {
  border-bottom: 1px solid #eee;
}
.tag-top {
  border-top: 1px solid #eee;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>