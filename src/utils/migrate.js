/*
 * @Descripttion: 迁徙曲线结合MapV
 * @Author: licheng
 * @Date: 2021-11-08 15:11:02
 * @LastEditors: licheng
 * @LastEditTime: 2021-12-08 15:10:56
 */
class Migrate {
  constructor (viewer, data) {
    // eslint-disable-next-line no-undef
    this.MapV = mapv
    this.mapLayer = [] // 图层
    this.curveLines = [] // 线
    this.cityPoints = [] // 点
    this.entitiesList = '' // 存放点数据和线数据
    this.curvePoints = [] // 发光线
    this.optionList = [
      {
        // 底线样式
        strokeStyle: 'rgba(255, 250, 50, 0.8)',
        shadowColor: 'rgba(255, 250, 50, 1)',
        shadowBlur: 20,
        lineWidth: 2,
        zIndex: 100,
        draw: 'simple'
      },
      {
        // 点样式
        fillStyle: 'rgba(254,175,3,0.7)',
        shadowColor: 'rgba(55, 50, 250, 0.5)',
        shadowBlur: 10,
        size: 5,
        zIndex: 10,
        draw: 'simple'
      }
    ]
    this.mapPointsOptions = {
      // 发光线样式
      fillStyle: 'rgba(255, 250, 250, 0.5)',
      zIndex: 200,
      size: 2.5,
      animation: {
        type: 'time', // 按时间展示动画
        stepsRange: { start: 0, end: 50 }, // 动画时间范围
        trails: 10, // 时间动画的拖尾大小
        duration: 2 // 单个动画的时间
      },
      draw: 'simple'
    }
    // 遍历每一条线
    for (var i = 0; i < data.length; i++) {
      let fromCityCenter = data[i].from // 起点坐标
      let toCityCenter = data[i].to // 终点坐标
      if (fromCityCenter && toCityCenter) {
        // 添加起点组
        this.cityPoints.push({
          geometry: {
            type: 'Point',
            coordinates: [fromCityCenter.lng, fromCityCenter.lat]
          }
        })
        // 添加终点组
        this.cityPoints.push({
          geometry: {
            type: 'Point',
            coordinates: [toCityCenter.lng, toCityCenter.lat]
          }
        })
        // 生成得抛物线组
        var curvePointsCoords = this.MapV.utilCurve.getPoints([
          fromCityCenter,
          toCityCenter
        ])
        for (let j = 0; j < curvePointsCoords.length; j++) {
          // 发光线添加
          this.curvePoints.push({
            geometry: {
              type: 'Point',
              coordinates: curvePointsCoords[j]
            },
            count: 1,
            time: j
          })
        }
        // 添加线
        this.curveLines.push({
          geometry: {
            type: 'LineString',
            coordinates: curvePointsCoords
          },
          count: 30 * Math.random()
        })
      }
    }
    this.entitiesList = [this.curveLines, this.cityPoints]
    this.drawBirdMove(viewer)
    this.drawBirdMovecurvePoints(viewer)
    this.isShowOrHidden('show')
  }
  // 发光线
  drawBirdMovecurvePoints (viewer) {
    // new Cesium.MapVLayer(viewer（指定三维视窗对象）, mapvDataset（json数据对象）, mapVOptions（指定MapV图层相关属性）, mapvContainer) // 添加一个MapV图层
    this.mapLayerPoints = this.MapV.cesiumMapLayer(
      viewer,
      this.getBirdMoveData(this.curvePoints),
      this.mapPointsOptions
    )
    return this.mapLayerPoints
  }
  // 底线和点
  drawBirdMove (viewer) {
    this.mapLayer = this.entitiesList.map((p, i) => {
      return this.MapV.cesiumMapLayer(
        viewer,
        this.getBirdMoveData(p),
        this.optionList[i]
      )
    })
  }
  // 加载实体数据
  getBirdMoveData (personal) {
    return new this.MapV.DataSet(personal)
  }
  // 删除所有数据
  removeBirdData () {
    if (
      this.mapLayer.length &&
      this.mapLayer.forEach(m => {
        m.removeAllData()
      })
    ) {
      this.mapLayer = []
    }
    if (this.mapLayerPoints.length > 0) {
      this.mapLayerPoints = []
    }
  }
  // 判断实体参数显隐
  isShowOrHidden (toggle) {
    if (toggle === 'show') {
      this.showOrHidden(true)
    } else if (toggle === 'hide') {
      this.showOrHidden(false)
    }
  }
  // 如果为true 显示  ，false 隐藏
  showOrHidden (toggle) {
    this.mapLayer.forEach(m => {
      toggle ? m.show() : m.hide()
    })
    toggle ? this.mapLayerPoints.show() : this.mapLayerPoints.hide()
  }
}
export default Migrate
