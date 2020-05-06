<template>
  <div id="report">
    <bread-crumb :itemData="['数据统计','数据报表']"></bread-crumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 760px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from "@/components/content/mianbaoxie/BreadCrumb";

import echarts from "echarts";

//网路请求
import { getReportData } from "@/network/report";
export default {
  name: "Report",
  data() {
    return {
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [{ boundarGap: false }],
        yAxis: [{ type: "value" }]
      }
    };
  },
  methods: {},
  components: {
    BreadCrumb,
    echarts
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    getReportData().then(res => {
      if (res.meta.status !== 200) {
        this.$message.error("获取数据失败");
      } else {
        var copyObj = Object.assign(this.options, res.data); //将两个对象合并
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(copyObj);
      }
    });
  }
};
</script>
<style scoped>
</style>