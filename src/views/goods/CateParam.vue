<template>
  <div id="params">
    <!-- 头部面包屑 -->
    <bread-crumb :itemData="['商品管理','商品参数']"></bread-crumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告提示 -->
      <el-row>
        <el-col :span="19">
          <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
        </el-col>
      </el-row>
      <!-- 选择商品分类 -->
      <el-row class="select-product">
        <el-col>
          <span class="cate-product">选择商品分类:</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectCateData"
            :options="parentList"
            :props="{ expandTrigger: 'hover',
              value:'cat_id',
              label:'cat_name',
              children:'children'
             }"
            change-on-select
            @change="selectAddCate"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签头--table切换栏 -->
      <el-tabs v-model="activeName" @tab-click="tableClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isAbled" @click="addParamsClick">添加参数</el-button>
          <!-- 动态参数表格渲染 -->
          <el-table :data="dynamicData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <template slot-scope="scoped">
              <el-tag v-for="(item,index) in scoped.attr_vals" :key="index">{{item}}</el-tag>
            </template>
            <el-table-column type="index" header-align="center" align="center"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name" header-align="center" align="center"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
              <template slot-scope="data">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialog(data.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteDialog(data.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isAbled" @click="addParamsClick">添加属性</el-button>
          <!-- 静态属性面板 -->
          <el-table :data="staticData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scoped">
                <el-tag v-for="(item,index) in scoped.attr_vals" :key="index">{{item}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" header-align="center" align="center"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name" header-align="center" align="center"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
              <template slot-scope="data">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialog(data.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteDialog(data.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + addTitele"
      :visible.sync="addCateParamsVisible"
      width="50%"
      @close="paramsClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="ParamsRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="addTitele" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addWinClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + addTitele"
      :visible.sync="editCateParamsVisible"
      width="50%"
      @close="paramsClose"
    >
      <el-form
        :model="editParamsForm"
        :rules="ParamsRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="addTitele" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editWinClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/content/mianbaoxie/BreadCrumb";

//导入--网络请求相关方法
import {
  getCateListInfo,
  getCateParams,
  addParamsData,
  deleteParamsInfo,
  editParamsInfo
} from "@/network/CateParam";

export default {
  name: "CateParam",
  data() {
    return {
      selectCateData: [], //级联选择器---必须为数组，用来保存添加分类级联选择框的选定数据
      parentList: [], //级联选择器---父级分类的列表数据
      activeName: "many", //tab栏激活的name
      dynamicData: [], //保存请求到的动态参数的数据
      staticData: [], //保存请求到的静态属性数据
      addCateParamsVisible: false,
      addParamsForm: {
        attr_name: ""
      }, //添加参数表单的数据
      editParamsForm: {
        //修改参数表单的数据
      },
      editCateParamsVisible: false,
      editId: 0, //修改参数请求需要的--属性id参数
      editCateId: 0, //修改参数请求需要的--分类id参数
      ParamsRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //级联选择器--选中节点改变时触发
    selectAddCate() {
      if (this.selectCateData.length != 3) {
        this.selectCateData = [];
      }
      this.getParams();
    },
    //tabs切换栏触发的事件
    tableClick() {
      this.getParams();
    },
    // 点击添加参数按钮
    addParamsClick() {
      this.addCateParamsVisible = true;
    },
    //点击编辑按钮
    editDialog(data) {
      this.editCateParamsVisible = true;
      this.editId = data.attr_id; // 通过插槽取得当前点击的按钮所对应的id
      this.editCateId = data.cat_id;
    },
    //关闭添加参数对话框触发
    paramsClose() {
      this.addParamsForm = {};
    },
    //删除参数按钮点击
    deleteDialog(data) {
      this.$confirm(`此操作将永久删除该${this.addTitele}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return deleteParamsInfo(data.cat_id, data.attr_id);
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getParams();
          } else {
            this.$message({
              type: "error",
              message: "删除失败!"
            });
            this.getParams();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //修改参数对话框里的确定按钮点击
    editWinClick() {
      const editName = this.editParamsForm.attr_name;
      const payload = {
        attr_name: editName,
        attr_sel: this.activeName
      };
      editParamsInfo(this.editCateId, this.editId, payload).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.$message.success("更新" + this.addTitele + "成功");
          this.getParams();
        }
      });
    },
    //添加参数对话框里的确定按钮的点击
    addWinClick() {
      console.log(this.addParamsForm);
      this.$refs.ruleForm.validate(flag => {
        if (flag) {
          this.addCateParamsVisible = false;
          const data = this.addParamsForm.attr_name;
          let payload = {
            attr_name: data,
            attr_sel: this.activeName
          };

          addParamsData(this.cateId, payload).then(res => {
            if (res.meta.status !== 201) {
              this.$message.error(res.meta.msg);
            } else {
              this.$message.success("添加" + this.addTitele + "成功");
              this.getParams();
            }
          });
        } else {
          return;
        }
      });
    },
    //请求方法过于重复--封装一层--代码复用
    getCateList() {
      getCateListInfo().then(res => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.parentList = res.data;
        }
      });
    },
    //请求参数列表的请求
    getParams() {
      getCateParams(this.cateId, this.activeName).then(res => {
        if (res.meta.status !== 200) {
          return;
        } else {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.split(" ");
          });
          if (this.activeName == "only") {
            this.staticData = res.data;
          } else if (this.activeName == "many") {
            this.dynamicData = res.data;
          }
        }
      });
    }
  },
  components: {
    BreadCrumb
  },
  computed: {
    isAbled() {
      //动态参数和静态参数按钮是否禁用
      if (this.selectCateData.length !== 3) {
        return true;
      } else return false;
    },
    cateId() {
      //请求参数列表的参数 id
      if (this.selectCateData.length === 3) {
        return this.selectCateData[2];
      } else {
        return null;
      }
    },
    //添加参数对话框的title
    addTitele() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  created() {
    this.getCateList();
  }
};
</script>
<style scoped>
.select-product {
  margin-top: 20px;
}
.el-cascader {
  width: 300px;
}
.cate-product {
  margin-right: 15px;
}
.el-table {
  margin-top: 15px;
}
</style>