<template>
  <!-- 添加商品组件 -->
  <div id="Add">
    <bread-crumb :itemData="['商品列表','添加商品']"></bread-crumb>
    <el-card>
      <!-- 提示条 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="400" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs栏 -->
      <el-form
        :model="addProductData"
        :rules="addProductRules"
        ref="addRuleForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          @tab-click="tabClick"
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addProductData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addProductData.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addProductData.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addProductData.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addProductData.goods_cat"
                :options="cateListData"
                :props="{ 
                  expandTrigger: 'hover',
                  label:'cat_name',
                  value:'cat_id',
                  children:'children' 
                  }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item1.attr_name"
              v-for="item1 in manyTableData"
              :key="item1.attr_id"
            >
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2,index) in item1.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :onSuccess="uploadSucc"
              :headers="headerObj"
              class="upload-demo"
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addProductData.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="addFinaly">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- //预览图片对话款 -->
    <el-dialog title="图片预览" :visible.sync="imgFlag" width="50%">
      <img :src="previewPath" alt style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/content/mianbaoxie/BreadCrumb";

//网络请求相关
import { getCateListInfo, getCateParams } from "@/network/CateParam";
import { sendProduct } from "@/network/productList";
export default {
  name: "AddProduct",
  data() {
    return {
      activeIndex: 0, //步骤条的高亮
      addProductData: {
        goods_cat: [],
        pics: [], //图片上传的信息
        goods_introduce: "", //富文本编辑区的内容
        attrs: []
      }, // 表单数据绑定
      addProductRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      }, //表单校验规则
      cateListData: [], //商品分类数据
      selectData: [], //级联选择器的数据
      manyTableData: [], //动态参数渲染部分--需要的数据
      onlyTableData: [], //静态属性数据
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      }, //图片上传请求头对象
      previewPath: "", //预览图片地址
      imgFlag: false
    };
  },
  computed: {
    cateId() {
      if (this.addProductData.goods_cat.length === 3) {
        return this.addProductData.goods_cat[2];
      } else return null;
    }
  },
  methods: {
    //级联选择器每次选择时触发
    handleChange() {
      if (this.addProductData.goods_cat.length !== 3) {
        this.addProductData.goods_cat = [];
      }
    },
    // tabs栏切换之前触发,last表示上次的activename，now代表要转换的tabs栏的activename
    beforeLeave(now, last) {
      if (last === "0" && this.addProductData.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // tabs栏子项的点击
    tabClick() {
      //如果activeIndex为1的话说明访问的是动态参数面板
      if (this.activeIndex == "1") {
        getCateParams(this.cateId, "many").then(res => {
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          });
          this.manyTableData = res.data;
        });
      } else if (this.activeIndex == "2") {
        getCateParams(this.cateId, "only").then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取静态属性失败");
          }
          this.onlyTableData = res.data;
        });
      }
    },
    //图片上传成功后的钩子函数
    uploadSucc(res) {
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
      } else {
        this.$message.success("上传图片成功");
        const picInfo = {
          pic: res.data.tmp_path
        };
        this.addProductData.pics.push(picInfo);
      }
    },
    //只要点击已经上传的图片就触发的钩子
    handlePreview(file) {
      this.previewPath = "";
      this.previewPath = file.response.data.url;
      this.imgFlag = true;
    },
    //图片上传移除的事件
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;

      const payload = this.addProductData.pics.findIndex(item => {
        item.pic === filePath;
      });
      this.addProductData.pics.spilce(1, 1);
    },
    //最终添加商品按钮点击
    addFinaly() {
      this.$refs.addRuleForm.validate(falg => {
        if (!falg) {
          return this.$message.error("请填写必要的表单项");
        } else {
          const cushion = JSON.stringify(this.addProductData); //深拷贝的垫子
          const ajax_obj = JSON.parse(cushion); //深拷贝一份表单数据对象

          ajax_obj.goods_cat = ajax_obj.goods_cat.join(",");
          //处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" ")
            };
            this.addProductData.attrs.push(newInfo);
          });
          //处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.addProductData.attrs.push(newInfo);
          });
          ajax_obj.attrs = this.addProductData.attrs;
          sendProduct(ajax_obj).then(res => {
            if (res.meta.status !== 201) {
              this.$message.error("添加商品失败");
              this.$router.push("goods");
            } else {
              this.$message.success("添加商品成功");
              this.$router.push("goods");
            }
          });
        }
      });
    }
  },
  created() {
    getCateListInfo().then(res => {
      this.cateListData = res.data;
    });
  },
  components: {
    BreadCrumb
  }
};
</script>
<style scoped>
.el-alert {
  height: 60px;
  margin-top: 15px;
}
.el-steps {
  margin-top: 50px;
  margin-bottom: 25px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.btnAdd {
  margin-top: 15px;
}
</style>