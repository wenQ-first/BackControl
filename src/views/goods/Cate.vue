<template>
  <!-- 商品列表页面 -->
  <div id="product-list">
    <bread-crumb :itemData="['商品管理','商品列表']"></bread-crumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 卡片区域--内部第一行添加和查找商品渲染部分 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="queryProductClick"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addProductClick">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格渲染部分 -->
      <el-table :data="goodsList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重置"></el-table-column>
        <el-table-column prop="add_time" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="data">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeClick(data.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页--区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from "@/components/content/mianbaoxie/BreadCrumb";

//网络请求
import { getProductList, removeProductList } from "@/network/productList";

//工具方法
import { formatDate } from "@/common/tool";

export default {
  name: "Cate",
  data() {
    return {
      // 获取商品列表信息的请求参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [], //请求获取到的商品列表信息
      total: 0
    };
  },
  components: {
    BreadCrumb
  },
  created() {
    this.getProductInfo();
  },
  methods: {
    //分页的数据渲染数据条数改变
    handleSizeChange(newpage) {
      this.queryInfo.pagesize = newpage;
      this.getProductInfo();
    },
    // 分页区域--页码改变时触发
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getProductInfo();
    },
    //搜索栏的点击
    queryProductClick() {
      this.getProductInfo();
    },
    //点击添加商品按钮
    addProductClick() {
      this.$router.push("/add");
    },
    //删除商品列表的按钮点击
    removeClick(params) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return removeProductList(params);
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getProductInfo();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //由于请求商品列表信息多次使用，封装一层，代码复用
    getProductInfo() {
      getProductList(this.queryInfo).then(res => {
        this.goodsList = res.data.goods;
        //利用封装的工具函数进行时间格式化
        this.goodsList.forEach(item => {
          item.add_time = formatDate(new Date(item.add_time), "yyyy-m-dd");
        });
        this.total = res.data.total;
      });
    }
  }
};
</script>
<style scoped>
.el-table {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>