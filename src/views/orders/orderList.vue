<template>
  <!-- 订单列表页面 -->
  <div id="orders">
    <!-- 头部面包屑 -->
    <bread-crumb :itemData="['订单管理','订单列表']"></bread-crumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="querySearch">
            <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="ordersData" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="data">
            <el-tag type="success" v-if="data.row.pay_status == '是'">已付款</el-tag>
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
          <template slot-scope="data">
            <el-tag type="success" v-if="data.row.is_send == '是'">已发货</el-tag>
            <el-tag type="danger" v-else>未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="data">
            <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="editAddress"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流进度" placement="top">
              <el-button @click="logisticsClick" size="mini" type="success" icon="el-icon-location"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogFlag" width="50%">
      <el-form
        :model="addresForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="addres1"></el-form-item>
        <el-form-item label="详细地址" prop="addres2">
          <el-input v-model="addresForm.addres2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="editDialogFlag = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话款 -->
    <el-dialog title="物流进度" :visible.sync="logisticsFlag" width="50%">
      <span>后台接口错误</span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/content/mianbaoxie/BreadCrumb";

//网络请求
import { getOrderData, getlogisticsData } from "@/network/orders";
import { formatDate } from "@/common/tool";
export default {
  name: "orderList",
  data() {
    return {
      querySearch: "", //查询数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      }, // 请求参数
      ordersData: [], //请求到的数据
      total: 0, //数据条数
      editDialogFlag: false,
      logisticsFlag: false,
      addresForm: {
        addres1: [],
        addres2: ""
      },
      rules: {
        addres1: [{ required: true, message: "请选择地址", trigger: "blur" }],
        addres2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      logisticsData: [] //物流进度信息
    };
  },
  created() {
    this.getOrderInfo();
  },
  methods: {
    //分页部分的大小改变
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderInfo();
    },
    //分页部分的页码改变
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getOrderInfo();
    },
    //点击修改地址按钮
    editAddress() {
      this.editDialogFlag = true;
    },
    // 物流信息的设置
    logisticsClick() {
      this.logisticsFlag = true;

      getlogisticsData().then(res => {
        if (res.meta.status !== 200) {
          this.$message.error("获取物流进度失败");
        } else {
          this.$message.error("请求已发出，后台接口维护!");
        }
        this.logisticsData = res.data;
      });
    },
    //搜索订单信息
    searchClick() {
      this.queryInfo.query = this.querySearch;
      this.getOrderInfo();
      this.$message.error("请求已发出，后台接口维护!");
    },
    //请求订单列表详情封装
    getOrderInfo() {
      getOrderData(this.queryInfo).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.total = res.data.total;
          this.ordersData = res.data.goods;
          this.ordersData.forEach(item => {
            const date = new Date(item.create_time);
            item.create_time = formatDate(date, "yyyy-MM-dd/hh:mm");
          });
        }
      });
    }
  },
  components: {
    BreadCrumb
  }
};
</script>
<style scoped>
.el-pagination {
  margin-top: 15px;
}
</style>