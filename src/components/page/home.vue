<template>
  <div class="content">
    <div id="myChart"></div>
    <div id="myChartPie"></div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
    }
  },
  mounted () {
    this.drawLine()
    this.drawPie()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        title: {
          text: '每日访问人数',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: ['7月10日', '7月11日', '7月12日', '7月13日', '7月14日', '7月15日', '7月16日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        }]
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
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  width: 100%;
  #myChart{
    width: 40%;
    height: 40%;
    margin: 20px;
    display: inline-block;
  }
  #myChartPie{
    width: 40%;
    height: 40%;
    margin: 20px;
    display: inline-block;
  }
}
</style>
