<!--
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-26 10:35:03
 * @LastEditors: licheng
 * @LastEditTime: 2021-11-30 14:46:08
-->
<template>
  <div class="content">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import Popup from '../../utils/popup'
export default {
  name: 'home',
  data () {
    return {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTYzNWM0ZS1lZGJkLTRiNjktODRiOS0zZGJmZjYwZmMxMDUiLCJpZCI6NzI1MTAsImlhdCI6MTYzNjA5OTUwOH0.Yd5Hevb_48TCL2s4D7OF2c8iIJIAuwocjYo-O_CGcEo',
      viewer: null,
      Box: null
    }
  },
  methods: {
    init () {
      // eslint-disable-next-line no-undef
      this.Box = new Cesium.Entity({
        name: '避难点',
        // eslint-disable-next-line no-undef
        position: Cesium.Cartesian3.fromDegrees(113.277178, 23.137995, 500),
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
        objId: '1',
        id: 'id'
      })
      let _this = this
      this.viewer.entities.add(this.Box)
      // eslint-disable-next-line no-undef
      var handler = new Cesium.ScreenSpaceEventHandler(
        _this.viewer.scene.canvas
      )
      handler.setInputAction(function (movement) {
        var pick = _this.viewer.scene.pick(movement.position)
        // eslint-disable-next-line no-undef
        var point = new Cesium.Cartesian2(
          movement.position.x,
          movement.position.y
        )
        // eslint-disable-next-line no-undef
        if (Cesium.defined(pick) && pick.id.id === 'id') {
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
            geometry: _this.viewer.scene.globe.pick(
              _this.viewer.camera.getPickRay(point),
              _this.viewer.scene
            )
          })
        }
      // eslint-disable-next-line no-undef
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    // 绘制轨迹
    trajectory () {
      let _this = this
      // eslint-disable-next-line no-undef
      var dataSource = new Cesium.CzmlDataSource()
      this.viewer.dataSources.add(dataSource)
      dataSource.process('static/MultipartVehicle_part1.czml').then(() => {
        _this.viewer.trackedEntity = dataSource.entities.getById('Vehicle')
      })
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    Cesium.Ion.defaultAccessToken = this.token
    // eslint-disable-next-line no-undef
    this.viewer = new Cesium.Viewer('cesiumContainer', {
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
      // eslint-disable-next-line no-undef
      imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        url:
          'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=594daef2db6509d78ea6d9601ce7ce4d',
        layer: 'tdtImgBasicLayer',
        style: 'default',
        format: 'image/jpeg',
        show: false
      })
    })
    this.viewer.imageryLayers.addImageryProvider(
      // eslint-disable-next-line no-undef
      new Cesium.WebMapTileServiceImageryProvider({
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
    // this.viewer.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(113.277178, 23.137995, 20000.0)
    // })
    this.init()
    this.trajectory()
  }
}
</script>

<style lang="less">
@import "../../style/popup.css";
#cesiumContainer {
  height: 100%;
}
</style>
