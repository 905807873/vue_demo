<!--
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-07-12 16:05:43
 * @LastEditors: licheng
 * @LastEditTime: 2022-09-20 17:55:56
-->
<template>
  <div class="content">
    <ToolBar @attribute="attributeVal"></ToolBar>
    <AttributeTab :attribute="attribute"></AttributeTab>
    <div id="mapDiv"></div>
  </div>
</template>

<script>
import ToolBar from "./components/ToolBar.vue";
import AttributeTab from "./components/attribute/index.vue";
import { loadModules } from "esri-loader";
export default {
  name: "Arcgis",
  data() {
    return {
      ESRI: [],
      view: null,
      attribute: null,
      token: "",
      geometry: ""
    };
  },
  components: { ToolBar, AttributeTab },
  methods: {
    initModules() {
      let importModules = [
        "esri/Map",
        "esri/views/MapView",
        "esri/views/SceneView",
        "esri/layers/GraphicsLayer",
        "esri/layers/SceneLayer",
        "esri/layers/MapImageLayer",
        "esri/layers/TileLayer",
        "esri/layers/support/LabelClass",
        "esri/layers/WebTileLayer",
        "esri/identity/IdentityManager",
        "esri/layers/BuildingSceneLayer"
      ];
      let EsriModules = importModules.map(x => {
        return x.split("/")[x.split("/").length - 1];
      });
      loadModules(importModules).then(arr => {
        for (let i = 0; i < arr.length; i++) {
          this.ESRI[EsriModules[i]] = arr[i];
        }
        this.$store.commit("setEsri", this.ESRI);
        this.getToken();
      });
    },
    initMap(token) {
      let _this = this;
      var baseMapBZ = new this.ESRI.WebTileLayer({
        id: "DT",
        urlTemplate:
          "http://t0.tianditu.com/DataServer?T=cva_w&x={col}&y={row}&l={level}&tk=594daef2db6509d78ea6d9601ce7ce4d"
      });
      var baseMapDT = new this.ESRI.WebTileLayer({
        id: "DT",
        urlTemplate:
          "http://t0.tianditu.com/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=594daef2db6509d78ea6d9601ce7ce4d"
      });

      const myMap = new this.ESRI.Map({
        layers: [baseMapDT, baseMapBZ]
      });

      const view = new this.ESRI.SceneView({
        map: myMap,
        container: "mapDiv",
        center: [113.632, 23.019],
        zoom: 10
      });
      const labelClass = new this.ESRI.LabelClass({
        symbol: {
          type: "label-3d", // autocasts as new LabelSymbol3D()
          symbolLayers: [
            {
              type: "text", // autocasts as new TextSymbol3DLayer()
              material: {
                color: "#F5F5F5"
              },
              font: {
                family: "Ubuntu Mono",
                size: 14,
                weight: "bold"
              },
              halo: {
                color: [255, 255, 0, 0.4], // autocasts as Color
                size: 1
              }
            }
          ]
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: 'DefaultValue($feature.NAME, "no data")'
        }
      });

      let layer = new this.ESRI.SceneLayer({
        url:
          "https://cim.gmdi.cn/dtsjygis/rest/services/Hosted/%E7%BA%AA%E5%BF%B5%E5%A0%82%E5%9C%B0%E9%93%81%E7%AB%99_WSL1/SceneServer"
      });
      let BuildingSceneLayer = new this.ESRI.BuildingSceneLayer({
        url:
          "https://cim.gmdi.cn/dtsjygis/rest/services/Hosted/%E5%A4%8F%E5%9B%AD%E7%AB%99%E5%9C%B0%E9%93%81%E6%A8%A1%E5%9E%8B/SceneServer"
      });
      let heightLayer = new this.ESRI.GraphicsLayer({
        id: "heightLayer",
        elevationInfo: {
          mode: "absolute-height"
        }
      });
      let graphicsLayer = new this.ESRI.GraphicsLayer({
        id: "mergeGraphicsLayer",
        title: "开挖底部",
        elevationInfo: {
          mode: "relative-to-ground",
          unit: "meters"
        }
      });
      view.map.addMany([layer, graphicsLayer, heightLayer]);
      window.view = view;

      view.ui.remove("zoom");
      view.ui.remove("attribution");
      view.ui.remove("navigation-toggle");
      view.ui.remove("compass");
      setTimeout(() => {
        view.goTo({
          tilt: 45
        });
        this.$store.commit("setView", view);
      }, 200);
      // 全局点击事件
      // let all = view.on('click', function (event) {
      //   view.hitTest(event).then(getGraphics => {
      //     let graphic = getGraphics.results[0].graphic
      //     debugger
      //   })
      // })
      this.view = view;
    },
    attributeVal(results) {
      this.attribute = results;
    },
    getToken() {
      let _this = this;
      this.$axios
        .request({
          url: "https://cim.gmdi.cn/portal/sharing/rest/generateToken",
          method: "post",
          data: "username=linapeng&password=gis@123456&f=json&referer=localhost"
        })
        .then(res => {
          if (res.data.ssl) {
            this.ESRI.IdentityManager.registerToken({
              server: "https://cim.gmdi.cn/dtsjygis/rest/services",
              token: res.data.token
            });
            this.token = res.data.token;
            this.initMap();
          }
        });
    },
    getGeoJson() {
      this.$axios
        .get("https://geo.datav.aliyun.com/areas_v3/bound/440100.json")
        .then(data => {
          this.geometry = data.data.features[0].geometry;
        });
    }
  },
  mounted() {
    this.initModules();
    this.getGeoJson();
  },
  created() {}
};
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
