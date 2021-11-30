<!--
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-07-12 16:05:43
 * @LastEditors: licheng
 * @LastEditTime: 2021-11-30 15:18:22
-->
<template>
  <div class="content">
    <ToolBar @attribute="attributeVal"></ToolBar>
    <AttributeTab :attribute="attribute"></AttributeTab>
    <div id="mapDiv"></div>
  </div>
</template>

<script>
import ToolBar from './components/ToolBar.vue'
import AttributeTab from './components/attribute/index.vue'
import { loadModules } from 'esri-loader'
export default {
  name: 'Arcgis',
  data () {
    return {
      ESRI: [],
      attribute: null
    }
  },
  components: { ToolBar, AttributeTab },
  methods: {
    initModules () {
      let importModules = [
        'esri/Map',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/MapImageLayer',
        'esri/layers/FeatureLayer',
        'esri/layers/support/LabelClass',
        'esri/layers/WebTileLayer',
        'esri/rest/identify',
        'esri/rest/support/IdentifyParameters'
      ]
      let EsriModules = importModules.map(x => {
        return x.split('/')[x.split('/').length - 1]
      })
      loadModules(importModules).then(arr => {
        for (let i = 0; i < arr.length; i++) {
          this.ESRI[EsriModules[i]] = arr[i]
        }
        this.$store.commit('setEsri', this.ESRI)
        this.initMap()
      })
    },
    initMap () {
      var baseMapBZ = new this.ESRI.WebTileLayer({
        id: 'DT',
        urlTemplate:
          'http://t0.tianditu.com/DataServer?T=cva_w&x={col}&y={row}&l={level}&tk=594daef2db6509d78ea6d9601ce7ce4d'
      })
      var baseMapDT = new this.ESRI.WebTileLayer({
        id: 'DT',
        urlTemplate:
          'http://t0.tianditu.com/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=594daef2db6509d78ea6d9601ce7ce4d'
      })

      const myMap = new this.ESRI.Map({
        layers: [baseMapDT, baseMapBZ]
      })
      const view = new this.ESRI.SceneView({
        map: myMap,
        container: 'mapDiv',
        center: [113.632, 23.019],
        zoom: 10
      })
      const labelClass = new this.ESRI.LabelClass({
        symbol: {
          type: 'label-3d', // autocasts as new LabelSymbol3D()
          symbolLayers: [
            {
              type: 'text', // autocasts as new TextSymbol3DLayer()
              material: {
                color: '#F5F5F5'
              },
              font: {
                family: 'Ubuntu Mono',
                size: 14,
                weight: 'bold'
              },
              halo: {
                color: [255, 255, 0, 0.4], // autocasts as Color
                size: 1
              }
            }
          ]
        },
        labelPlacement: 'above-center',
        labelExpressionInfo: {
          expression: 'DefaultValue($feature.NAME, "no data")'
        }
      })
      let hpZzc = new this.ESRI.FeatureLayer({
        url:
          'http://192.168.3.180:6080/arcgis/rest/services/GZXZQH/FeatureServer',
        layerId: 0,
        maxScale: 0,
        labelingInfo: [labelClass],
        elevationInfo: {
          mode: 'on-the-ground'
        },
        renderer: {
          type: 'simple', // autocasts as new SimpleRenderer()
          symbol: {
            type: 'polygon-3d', // autocasts as new PolygonSymbol3D()
            symbolLayers: [
              {
                type: 'extrude', // autocasts as new ExtrudeSymbol3DLayer()
                material: {
                  color: [244, 247, 134]
                }
              }
            ]
          },
          visualVariables: [
            {
              type: 'size',
              field: 'color',
              stops: [{ label: 'z_max-z_min<2', size: 2000, value: 0 }]
            },
            {
              type: 'color',
              field: 'color',
              legendOptions: {
                title: '% population with income below poverty level'
              },
              stops: [
                {
                  value: 8,
                  color: 'rgba(190,225,252,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 7,
                  color: 'rgba(158,206,251,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 4,
                  color: 'rgba(95,159,246,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 2,
                  color: 'rgba(134,188,249,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 5,
                  color: 'rgba(158,206,251,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 6,
                  color: 'rgba(190,225,252,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 18,
                  color: 'rgba(72,123,211,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 1,
                  color: 'rgba(95,159,246,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 16,
                  color: 'rgba(95,159,246,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 14,
                  color: 'rgba(158,206,251,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 15,
                  color: 'rgba(134,188,249,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 17,
                  color: 'rgba(255,255,255,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 9,
                  color: 'rgba(158,206,251,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 13,
                  color: 'rgba(190,225,252,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 12,
                  color: 'rgba(95,159,246,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 10,
                  color: 'rgba(72,123,211,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 3,
                  color: 'rgba(190,225,252,0.8)',
                  label: 'z_max-z_min<3'
                },
                {
                  value: 11,
                  color: 'rgba(134,188,249,0.8)',
                  label: 'z_max-z_min<3'
                }
              ]
            }
          ]
        }
      })
      view.map.addMany([hpZzc])
      view.ui.remove('zoom')
      view.ui.remove('attribution')
      view.ui.remove('navigation-toggle')
      view.ui.remove('compass')
      setTimeout(() => {
        view.goTo({
          tilt: 45
        })
        this.$store.commit('setView', view)
      }, 200)
      // 全局点击事件
      // let all = view.on('click', function (event) {
      //   view.hitTest(event).then(getGraphics => {
      //     let graphic = getGraphics.results[0].graphic
      //     debugger
      //   })
      // })
    },
    attributeVal (results) {
      this.attribute = results
    }
  },
  mounted () {
    this.initModules()
  },
  created () {}
}
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  width: 100%;
  #mapDiv {
    height: 100%;
    width: 100%;
  }
}
</style>
