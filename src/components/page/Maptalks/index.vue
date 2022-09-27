<!--
 * @Descripttion: Maptalks
 * @Author: licheng
 * @Date: 2022-01-11 13:55:27
 * @LastEditors: licheng
 * @LastEditTime: 2022-01-13 16:12:21
-->

<template>
  <div class="MaptalksContent">
    <div id="MaptalksMap">
      Maptalks
    </div>
    <div class="MaptalksTool">
      <el-button @click="addPoint()">添加海量点效果</el-button>
      <el-button @click="addEarthQuakes()">添加地震点效果</el-button>
      <el-button @click="remove()">移除</el-button>
    </div>
  </div>
</template>

<script>
// import * as maptalks from 'maptalks'
import traces from '../../../../static/json/trajectories'
import earthquakes from '../../../../static/json/all_month'
// plugin's classes should be imported directly like
// import { ThreeLayer } from 'maptalks.three'
// import { BigPointLayer } from 'maptalks.biglayer'

export default {
  name: 'home',
  data () {
    return {
      map: null
    }
  },
  methods: {
    init () {
      this.map = new maptalks.Map('MaptalksMap', {
        center: [116.32101, 40.00279],
        zoom: 15,
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c']
        })
      })
    },
    addPoint () {
      this.remove()
      this.map.setZoom(15)
      this.map.setCenter([116.32101, 40.00279])
      var symbol = {
        markerType: 'ellipse',
        kerWidth: 2,
        markerHeight: 2,
        markerFill: 'rgba(86, 197, 234, 0.3)',
        markerLineOpacity: 0
      }
      var data = traces.map(function (d) {
        return [d[0] + 110, d[1] + 35, 1]
      })

      var layer = new maptalks.BigPointLayer('trajectories', data)
        .setStyle({
          filter: true,
          symbol: symbol
        })
        .addTo(this.map)
    },
    addEarthQuakes () {
      this.remove()
      this.map.setZoom(4)
      var geometries = maptalks.GeoJSON.toGeometry(earthquakes)
      var layer = new maptalks.AnimateMarkerLayer('animatemarker', geometries, {
        animation: 'scale,fade',
        randomAnimation: true,
        geometryEvents: false
      })
        .setStyle([
          {
            filter: ['<=', 'mag', 2],
            symbol: {
              markerType: 'ellipse',
              markerLineWidth: 0,
              markerFill: getGradient([135, 196, 240]),
              markerFillOpacity: 0.8,
              markerWidth: 5,
              markerHeight: 5
            }
          },
          {
            filter: ['<=', 'mag', 5],
            symbol: {
              markerType: 'ellipse',
              markerLineWidth: 0,
              markerFill: getGradient([255, 255, 0]),
              markerFillOpacity: 0.8,
              markerWidth: 12,
              markerHeight: 12
            }
          },
          {
            filter: ['>', 'mag', 5],
            symbol: {
              markerType: 'ellipse',
              markerLineWidth: 0,
              markerFill: getGradient([216, 115, 149]),
              markerFillOpacity: 0.8,
              markerWidth: 20,
              markerHeight: 20
            }
          }
        ])
        .addTo(this.map)
      function getGradient (colors) {
        return {
          type: 'radial',
          colorStops: [
            [0.7, 'rgba(' + colors.join() + ', 0.5)'],
            [0.3, 'rgba(' + colors.join() + ', 1)'],
            [0.2, 'rgba(' + colors.join() + ', 1)'],
            [0.0, 'rgba(' + colors.join() + ', 0)']
          ]
        }
      }
    },
    remove () {
      this.map._layers.forEach(x => {
        x.remove()
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
.MaptalksContent {
  height: 100%;
  width: 100%;
  #MaptalksMap {
    height: 100%;
    width: 100%;
  }
  .heading {
    background-color: #34495e;
    color: #fff;
    padding: 8px 8px;
    font: 24px sans-serif;
  }
  .MaptalksTool {
    position: absolute;
    top: 80px;
    left: 20px;
  }
}
</style>
