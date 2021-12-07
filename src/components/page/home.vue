<template>
  <div class="content">
    <div id="myChartLine"></div>
    <div id="myChartPie"></div>
    <div id="myChartTable">
      <el-table
        :data="tableData"
        stripe
        border
        height="350"
        style="width: 100%"
      >
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
      </el-table>
    </div>
    <div id="myChartBar"></div>
  </div>
</template>

<script>
import 'echarts/extension/bmap/bmap.js'
export default {
  name: 'home',
  data () {
    return {
      geoJson: null,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  mounted () {
    this.drawLine()
    this.drawPie()
    this.drawBar()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChartLine'))
      myChart.setOption({
        title: {
          text: '每日访问人数',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: [
            '7月10日',
            '7月11日',
            '7月12日',
            '7月13日',
            '7月14日',
            '7月15日',
            '7月16日'
          ]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      })
    },
    drawPie () {
      let myChart = this.$echarts.init(document.getElementById('myChartPie'))
      myChart.setOption({
        title: {
          text: '访问来源',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '10%',
          left: 'center'
        },
        series: [
          {
            name: '访问来源',
            top: '5%',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '谷歌搜索' },
              { value: 735, name: '百度搜索' },
              { value: 580, name: '360搜索' },
              { value: 484, name: '搜狗' },
              { value: 300, name: '必应' }
            ]
          }
        ]
      })
    },
    drawBar () {
      let myChart = this.$echarts.init(document.getElementById('myChartBar'))
      myChart.setOption({
        title: {
          text: '访问来源',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '10%',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: ['谷歌搜索', '百度搜索', '360搜索', '搜狗', '必应']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [1048, 735, 580, 484, 3000],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  width: 100%;
  #myChartLine {
    width: 40%;
    height: 40%;
    margin: 20px;
    display: inline-block;
  }
  #myChartPie {
    width: 40%;
    height: 40%;
    margin: 20px;
    display: inline-block;
  }
  #myChartTable {
    width: 40%;
    height: 40%;
    margin: 20px;
    display: inline-block;
  }
  #myChartBar {
    width: 40%;
    height: 40%;
    margin: 20px;
    display: inline-block;
  }
}
</style>
