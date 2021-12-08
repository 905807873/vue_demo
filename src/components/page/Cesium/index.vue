<!--
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-26 10:35:03
 * @LastEditors: licheng
 * @LastEditTime: 2021-12-08 15:26:48
-->
<template>
  <div class="content">
    <div id="cesiumContainer"></div>
    <div class="toolBox">
      <el-button
        @click="change(item.id)"
        v-for="item in toolList"
        :key="item.id"
        >{{ item.title }}</el-button
      >
    </div>
  </div>
</template>

<script>
import Popup from '../../../utils/popup'
import Migrate from '../../../utils/migrate'
export default {
  name: 'home',
  data () {
    return {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTYzNWM0ZS1lZGJkLTRiNjktODRiOS0zZGJmZjYwZmMxMDUiLCJpZCI6NzI1MTAsImlhdCI6MTYzNjA5OTUwOH0.Yd5Hevb_48TCL2s4D7OF2c8iIJIAuwocjYo-O_CGcEo',
      viewer: null,
      Box: null,
      Cesium: null, // Cesium构造函数
      migrate: null,
      toolList: [
        {
          title: '车辆轨迹效果',
          id: 'carTrajectory'
        },
        {
          title: '动态墙呼吸效果',
          id: 'dynamicWall'
        },
        {
          title: '扩散圆效果',
          id: 'diffusionCircle'
        },
        {
          title: '迁徙图曲线效果',
          id: 'migrate'
        },
        {
          title: '清除效果',
          id: 'clear'
        }
      ]
    }
  },
  methods: {
    init () {
      this.Box = new this.Cesium.Entity({
        name: '避难点',
        id: 'point',
        position: this.Cesium.Cartesian3.fromDegrees(113.277178, 23.137995, 0),
        billboard: {
          show: true, // default 是否显示该实体
          image: '/static/images/point.png'
        },
        properties: {
          避难点名称: 'XX避难点',
          联系方式: '188XXXXXXXX',
          可容纳人数: '1816'
        },
        layerId: 'Box',
        objId: '1'
      })
      let _this = this
      this.viewer.entities.add(this.Box)
      var handler = new this.Cesium.ScreenSpaceEventHandler(
        _this.viewer.scene.canvas
      )
      handler.setInputAction(function (movement) {
        var pick = _this.viewer.scene.pick(movement.position)
        // var point = new _this.Cesium.Cartesian2(
        //   movement.position.x,
        //   movement.position.y
        // )
        if (_this.Cesium.defined(pick) && pick.id.id === 'point') {
          let properties = {}
          let name = pick.id.name
          for (let key in pick.id.properties._propertyNames) {
            let title = pick.id.properties._propertyNames[key]
            let value = pick.id.properties[title]._value
            properties[title] = value
          }
          // eslint-disable-next-line no-unused-vars
          let popup = new Popup({
            name: name,
            viewer: _this.viewer,
            properties: properties,
            // 根据点击点位获取坐标
            // geometry: _this.viewer.scene.globe.pick(
            //   _this.viewer.camera.getPickRay(point),
            //   _this.viewer.scene
            // )
            geometry: pick.id.position._value
          })
        }
      }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    // 绘制轨迹
    trajectory () {
      let _this = this
      var dataSource = new this.Cesium.CzmlDataSource()
      this.viewer.dataSources.add(dataSource)
      dataSource.process('static/MultipartVehicle_part1.czml').then(() => {
        _this.viewer.trackedEntity = dataSource.entities.getById('Vehicle')
      })
    },
    /**
     * 绘制立体墙, 带呼吸灯效果
     * @param viewer
     */
    drawWall (viewer) {
      let _this = this
      var alp = 1
      var num = 0
      var height = 100 // 墙高度
      let flag = false // 上升下降状态
      let latlon = [
        113.282178,
        23.142995,
        113.282178,
        23.132995,
        113.272178,
        23.132995,
        113.272178,
        23.142995,
        113.282178,
        23.142995
      ]
      // 绘制墙
      var wall = viewer.entities.add({
        name: '动态立体墙',
        id: 'dynamicWall',
        wall: {
          show: true,
          positions: _this.Cesium.Cartesian3.fromDegreesArray(latlon),
          material: new _this.Cesium.ImageMaterialProperty({
            image: '/static/images/red.png',
            transparent: true,
            color: new _this.Cesium.CallbackProperty(function () {
              if (num % 2 === 0) {
                alp -= 0.02
              } else {
                alp += 0.02
              }
              if (alp <= 0.3) {
                num++
              } else if (alp >= 1) {
                num++
              }
              return _this.Cesium.Color.WHITE.withAlpha(alp)
              // entity的颜色透明 并不影响材质，并且 entity也会透明
            }, false)
          }),
          maximumHeights: new _this.Cesium.CallbackProperty(function () {
            if (height > 200) {
              height -= 5
              flag = false
            } else {
              if (flag) {
                height += 5
              } else {
                height -= 5
              }
            }
            if (height < 100) {
              flag = true
            }
            return [height, height, height, height, height]
          }, false)
        }
      })
      viewer.zoomTo(wall) // 相机到entity的位置
    },
    /**
     * 绘制扩散圆, 带呼吸灯效果
     * @param viewer
     */
    drawEllipse (viewer) {
      let r1 = 100
      let r2 = 100
      let ellipse = viewer.entities.add({
        id: 'diffusionCircle',
        position: this.Cesium.Cartesian3.fromDegrees(113.277178, 23.137995),
        ellipse: {
          semiMinorAxis: new this.Cesium.CallbackProperty(function () {
            r1 = r1 + 10
            if (r1 >= 1000) {
              r1 = 100
            }
            return r1
          }, false),
          semiMajorAxis: new this.Cesium.CallbackProperty(function () {
            r2 = r2 + 10
            if (r2 >= 1000) {
              r2 = 100
            }
            return r2
          }, false),
          material: new this.Cesium.ImageMaterialProperty({
            image: '/static/images/red2.png',
            color: this.Cesium.Color.WHITE.withAlpha(0.4)
          })
        }
      })
      viewer.zoomTo(ellipse) // 相机到entity的位置
    },
    /**
     * 迁徙效果(曲线)
     * @param viewer
     */
    async birdMigrate (viewer) {
      // 定位视角
      this.viewer.camera.flyTo({
        destination: this.Cesium.Cartesian3.fromDegrees(
          113.277178,
          23.137995,
          20000.0
        )
      })
      let dataList
      await this.$axios('./static/json/data.json').then(res => {
        dataList = res.data
      })
      // 处理数据
      let data = []
      for (let i = 0; i < dataList.length; i++) {
        let start = [113.277178, 23.137995]
        let end = dataList[i].coordinates
        let dataItem = {}
        dataItem.from = { lng: start[0], lat: start[1] }
        dataItem.count = dataList[i].number
        dataItem.to = { lng: end[0], lat: end[1] }
        data.push(dataItem)
      }
      this.migrate = new Migrate(this.viewer, data)
    },
    change (id) {
      this.clear()
      switch (id) {
        case 'carTrajectory':
          this.trajectory() // 车辆运行轨迹
          break
        case 'dynamicWall':
          this.drawWall(this.viewer)
          break
        case 'diffusionCircle':
          this.drawEllipse(this.viewer)
          break
        case 'clear':
          this.clear()
          break
        case 'migrate':
          this.birdMigrate()
          break

        default:
          break
      }
    },
    clear () {
      this.viewer.dataSources.removeAll()
      this.viewer.entities.removeById('diffusionCircle')
      this.viewer.entities.removeById('dynamicWall')
      if (this.migrate) {
        this.migrate.isShowOrHidden('hide')
      }
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.Cesium = Cesium
    this.Cesium.Ion.defaultAccessToken = this.token
    this.viewer = new this.Cesium.Viewer('cesiumContainer', {
      animation: false,
      shouldAnimate: true,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      imageryProvider: new this.Cesium.WebMapTileServiceImageryProvider({
        url:
          'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=594daef2db6509d78ea6d9601ce7ce4d',
        layer: 'tdtImgBasicLayer',
        style: 'default',
        format: 'image/jpeg',
        show: false
      })
    })
    this.viewer.imageryLayers.addImageryProvider(
      new this.Cesium.WebMapTileServiceImageryProvider({
        url:
          'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=594daef2db6509d78ea6d9601ce7ce4d',
        layer: 'tdtImgAnnoLayer',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible',
        show: false
      })
    )
    this.viewer._cesiumWidget._creditContainer.style.display = 'none'
    // 定位视角
    this.viewer.camera.flyTo({
      destination: this.Cesium.Cartesian3.fromDegrees(
        113.277178,
        23.137995,
        20000.0
      )
    })
    this.init() // 初始化
  }
}
</script>

<style lang="less">
@import "../../../style/popup.css";
.content {
  position: relative;
  #cesiumContainer {
    height: 100%;
  }
  .toolBox {
    position: absolute;
    top: 50px;
    left: 50px;
  }
}
</style>
