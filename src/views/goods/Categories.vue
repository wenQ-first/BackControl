<template>
  <!-- 商品分类页面 -->
  <div id="Categories">
    <!-- 头部面包屑 -->
    <bread-crumb :itemData="['商品管理','商品分类']"></bread-crumb>

    <!-- 卡片视图 --主体部分 -->
    <el-card>
      <el-row class="first-row">
        <el-col :span="7">
          <el-button type="primary" @click="addCateClick">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树形表格渲染部分 -->
      <tree-table
        :show-row-hover="false"
        border
        index-text="#"
        show-index
        :data="cateList"
        :expand-type="false"
        :selection-type="false"
        :columns="columns"
      >
        <!-- 是否有效列的插槽 -->
        <template slot="icon" slot-scope="data">
          <i
            v-if="data.row.cat_deleted === false"
            class="el-icon-circle-check"
            :style="{color:'lightgreen'}"
          ></i>
          <i v-else class="el-icon-error" :style="{color:'red'}"></i>
        </template>
        <!-- 排序列的 插槽-->
        <template slot="tag" slot-scope="data">
          <el-tag v-if="data.row.cat_level == 0">一级</el-tag>
          <el-tag v-if="data.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-if="data.row.cat_level == 2" type="warning">三级</el-tag>
        </template>
        <!-- 操作列的插槽 -->
        <template slot="operate" slot-scope="data">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteClick(data.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页--页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateTotal"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateFlag" width="30%" @close="AddCateFormClose">
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateForm" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectCateData"
            :options="parentList"
            :props="{ expandTrigger: 'hover',
              value:'cat_id',
              label:'cat_name',
              children:'children'
             }"
            change-on-select
            clearable
            @change="selectAddCate"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateFlag = false">取 消</el-button>
        <el-button type="primary" @click="selectClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/content/mianbaoxie/BreadCrumb";

//导入 网络请求相关方法
import {
  getCateListInfo,
  getParentCateInfo,
  sendAddCate,
  deleteAddCate
} from "@/network/goods.js";

export default {
  name: "Categories",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      }, //查询分类条件
      cateList: [], //分类数据保存
      cateTotal: 0, //分类数据的总数
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "300px",
          headerAlign: "center"
        },
        {
          label: "是否有效",
          width: "150px",
          headerAlign: "center",
          align: "center",
          type: "template",
          template: "icon"
        },
        {
          label: "排序",
          headerAlign: "center",
          align: "center",
          type: "template",
          template: "tag"
        },
        {
          label: "操作",
          minWidth: "200px",
          type: "template",
          template: "operate",
          headerAlign: "center",
          align: "center"
        }
      ],
      sumPage: 5, //记录当前页的记录条数
      addCateFlag: false, //控制添加分类对话框的显示与否
      addCateForm: {
        cat_name: "", // 分类名称
        cat_pid: 0, //分类父级id
        cat_level: 0 //当前分类等级
      }, // 表单数据对象
      parentList: [], //父级分类的列表数据
      addCateRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      }, //添加分类表单验证规则
      selectCateData: [] //必须为数组，用来保存添加分类级联选择框的选定数据
    };
  },
  components: {
    BreadCrumb
  },
  methods: {
    //事件监听

    handleSizeChange(newpage) {
      //页面表格内数据显示大小改变
      this.queryInfo.pagesize = newpage;
      this.sumPage = newpage; // 由于后台接口参数错误，无法获得指定条数 只能一次性获得全部数据，所以只能自己进行处理
      this.cateList = []; //由于接口数据错误，后台没法获得指定条数
      this.getCateList();
    },
    handleCurrentChange(data) {
      //页码数该变
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    //添加分类按钮点击事件
    addCateClick() {
      //先请求父级列表信息
      getParentCateInfo().then(res => {
        this.parentList = res.data;
      });
      this.addCateFlag = true;
      console.log(this.parentList);
    },
    // 级联选择器的内容改变时触发
    selectAddCate() {
      if (this.selectCateData.length > 0) {
        //为选中的分类赋值父级分类的id值
        this.addCateForm.cat_pid = this.selectCateData[
          this.selectCateData.length - 1
        ];
        this.addCateForm.cat_level = this.selectCateData.length; //为选中的分类赋值分类等级
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    //添加分类对话框关闭
    AddCateFormClose() {
      this.selectCateData = [];
      this.addCateForm = {};
    },
    //点击添加分类对话款里的确定按钮
    selectClick() {
      this.$refs.addCateForm.validate(flag => {
        if (flag) {
          sendAddCate(this.addCateForm).then(res => {
            if (res.meta.status !== 201) {
              this.$message.error(res.meta.msg);
            } else {
              this.$message.success("添加分类成功");
              this.getCateList();
              this.addCateFlag = false;
            }
          });
        } else {
          return;
        }
      });
    },
    //删除分类按钮的点击
    deleteClick(params) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return deleteAddCate(params.cat_id);
        })
        .then(res => {
          if (res.meta.status == 200) {
            this.$message.success("删除分类成功");
            this.getCateList();
          }
        })
        .catch(() => {
          this.$message.error("取消删除");
        });
    },
    //请求商品分类数据
    getCateList() {
      this.cateList = [];
      getCateListInfo(this.queryInfo).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          //this.cateList = res.data;
          this.cateTotal = res.data.length;
          for (let i = 0; i < this.sumPage; i++) {
            this.cateList.push(res.data[i]);
          }
        }
      });
    }
  },
  created() {
    this.getCateList();
  }
};
</script>
<style scoped>
.first-row {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>