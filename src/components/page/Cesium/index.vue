<!--
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-26 10:35:03
 * @LastEditors: licheng
 * @LastEditTime: 2022-08-25 16:21:07
-->
<template>
  <div class="content">
    <div class="container-integrate">
      <!--cesium容器-->
      <div id="cesiumContainer"></div>
    </div>
    <div class="toolBox">
      <el-button
        @click="change(item.id)"
        v-for="item in toolList"
        :key="item.id"
        :class="[selectBotton === item.id ? 'selectBotton' : '']"
        >{{ item.title }}</el-button
      >
    </div>
  </div>
</template>

<script>
import Popup from "../../../utils/popup";
import Migrate from "../../../utils/migrate";
import addThree from "./js/addthree.js";
export default {
  name: "home",
  data() {
    return {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTYzNWM0ZS1lZGJkLTRiNjktODRiOS0zZGJmZjYwZmMxMDUiLCJpZCI6NzI1MTAsImlhdCI6MTYzNjA5OTUwOH0.Yd5Hevb_48TCL2s4D7OF2c8iIJIAuwocjYo-O_CGcEo",
      viewer: null,
      Cesium: null, // Cesium构造函数
      migrate: null,
      selectBotton: null,
      toolList: [
        {
          title: "车辆轨迹效果",
          id: "carTrajectory"
        },
        {
          title: "动态墙呼吸效果",
          id: "dynamicWall"
        },
        {
          title: "扩散圆效果",
          id: "diffusionCircle"
        },
        {
          title: "扇形雷达效果",
          id: "drawSector"
        },

        {
          title: "迁徙图曲线效果",
          id: "migrate"
        },
        {
          title: "叠加THREE模型",
          id: "three"
        },
        {
          title: "清除效果",
          id: "clear"
        }
      ],
      pointArr: [
        {
          name: "天河区",
          coordinate: [113.277178, 23.137995, 0]
        },
        {
          name: "白云区",
          coordinate: [113.280008, 23.165646, 0]
        },
        {
          name: "黄埔区",
          coordinate: [113.487552, 23.189566, 0]
        },
        {
          name: "海珠区",
          coordinate: [113.324851, 23.089073, 0]
        },
        {
          name: "增城区",
          coordinate: [113.818174, 23.267935, 0]
        },
        {
          name: "花都区",
          coordinate: [113.224861, 23.413402, 0]
        },
        {
          name: "从化区",
          coordinate: [113.584758, 23.556587, 0]
        }
      ]
    };
  },
  methods: {
    init() {
      let _this = this;

      this.pointArr.forEach((item, index) => {
        let entity = new this.Cesium.Entity({
          name: "避难点",
          id: "point" + item.name,
          position: this.Cesium.Cartesian3.fromDegrees(
            item.coordinate[0],
            item.coordinate[1],
            item.coordinate[2]
          ),
          billboard: {
            show: true, // default 是否显示该实体
            image: "/static/images/point.png"
          },
          label: {
            // 文字标签
            text: item.name + "避难点",
            font: "20px sans-serif",
            style: this.Cesium.LabelStyle.FILL,
            pixelOffset: new this.Cesium.Cartesian2(0, -60),
            showBackground: true,
            backgroundColor: new this.Cesium.Color.fromBytes(0, 70, 24)
          },
          properties: {
            避难点名称: item.name + "避难点",
            联系方式: "188XXXXXXXX",
            可容纳人数: "1816"
          },
          layerId: "Box",
          objId: item.name
        });
        this.viewer.entities.add(entity);
      });

      var handler = new this.Cesium.ScreenSpaceEventHandler(
        _this.viewer.scene.canvas
      );
      handler.setInputAction(function(movement) {
        var pick = _this.viewer.scene.pick(movement.position);
        if (_this.Cesium.defined(pick) && pick.id.id.includes("point")) {
          let properties = {};
          let name = pick.id.name;
          for (let key in pick.id.properties._propertyNames) {
            let title = pick.id.properties._propertyNames[key];
            let value = pick.id.properties[title]._value;
            properties[title] = value;
          }
          // eslint-disable-next-line no-unused-vars
          let popup = new Popup({
            name: name,
            viewer: _this.viewer,
            properties: properties,
            geometry: pick.id.position._value
          });
        }
      }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    initThrees() {
      addThree.initThree(this.viewer);
    },
    // 绘制轨迹
    trajectory() {
      let _this = this;
      var dataSource = new this.Cesium.CzmlDataSource();
      this.viewer.dataSources.add(dataSource);
      dataSource.process("static/MultipartVehicle_part1.czml").then(() => {
        _this.viewer.trackedEntity = dataSource.entities.getById("Vehicle");
      });
    },
    /**
     * 绘制立体墙, 带呼吸灯效果
     * @param viewer
     */
    drawWall(viewer) {
      let _this = this;
      var alp = 1;
      var num = 0;
      var height = 100; // 墙高度
      let flag = false; // 上升下降状态
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
      ];
      // 绘制墙
      var wall = viewer.entities.add({
        name: "动态立体墙",
        id: "dynamicWall",
        wall: {
          show: true,
          positions: _this.Cesium.Cartesian3.fromDegreesArray(latlon),
          material: new _this.Cesium.ImageMaterialProperty({
            image: "/static/images/red.png",
            transparent: true,
            color: new _this.Cesium.CallbackProperty(function() {
              if (num % 2 === 0) {
                alp -= 0.02;
              } else {
                alp += 0.02;
              }
              if (alp <= 0.3) {
                num++;
              } else if (alp >= 1) {
                num++;
              }
              return _this.Cesium.Color.WHITE.withAlpha(alp);
              // entity的颜色透明 并不影响材质，并且 entity也会透明
            }, false)
          }),
          maximumHeights: new _this.Cesium.CallbackProperty(function() {
            if (height > 200) {
              height -= 5;
              flag = false;
            } else {
              if (flag) {
                height += 5;
              } else {
                height -= 5;
              }
            }
            if (height < 100) {
              flag = true;
            }
            return [height, height, height, height, height];
          }, false)
        }
      });
      viewer.zoomTo(wall); // 相机到entity的位置
    },
    /**
     * 绘制扇形雷达效果
     * @param viewer
     */
    drawSector(viewer) {
      let num = 0;
      let maxAngle = 1000;
      let num1 = 0;
      viewer.entities.removeById("dynamicSector");
      let ellipse = viewer.entities.add({
        id: "dynamicSector",
        position: this.Cesium.Cartesian3.fromDegrees(113.277178, 23.137995),

        orientation: new this.Cesium.CallbackProperty(() => {
          num += 0.3;
          if (num >= maxAngle) num1 = 0;
          return this.Cesium.Transforms.headingPitchRollQuaternion(
            this.Cesium.Cartesian3.fromDegrees(113.277178, 23.137995),
            new this.Cesium.HeadingPitchRoll((num * Math.PI) / 180, 0, 0)
          );
        }, false),
        ellipsoid: {
          radii: new this.Cesium.Cartesian3(5000.0, 5000.0, 2000.0), // 扇形半径
          innerRadii: new this.Cesium.Cartesian3(1.0, 1.0, 1.0), // 内半径
          minimumClock: this.Cesium.Math.toRadians(-10),
          maximumClock: this.Cesium.Math.toRadians(10),
          minimumCone: this.Cesium.Math.toRadians(90), // 上下偏角  可以都设置为90
          maximumCone: this.Cesium.Math.toRadians(90),
          material: this.Cesium.Color.GREEN.withAlpha(0.5),
          outline: true,
          outlineColor: this.Cesium.Color.GREEN.withAlpha(0.8),
          heightReference: this.Cesium.HeightReference.CLAMP_TO_GROUND // RELATIVE_TO_GROUND CLAMP_TO_GROUND
        }
      });
      viewer.zoomTo(ellipse); // 相机到entity的位置
    },
    /**
     * 绘制扩散圆, 带呼吸灯效果
     * @param viewer
     */
    drawEllipse(viewer) {
      let r1 = 100;
      let r2 = 100;
      let ellipse = viewer.entities.add({
        id: "diffusionCircle",
        position: this.Cesium.Cartesian3.fromDegrees(113.277178, 23.137995),
        ellipse: {
          semiMinorAxis: new this.Cesium.CallbackProperty(function() {
            r1 = r1 + 10;
            if (r1 >= 1000) {
              r1 = 100;
            }
            return r1;
          }, false),
          semiMajorAxis: new this.Cesium.CallbackProperty(function() {
            r2 = r2 + 10;
            if (r2 >= 1000) {
              r2 = 100;
            }
            return r2;
          }, false),
          material: new this.Cesium.ColorMaterialProperty(
            this.Cesium.Color.RED.withAlpha(0.4)
          )
        }
      });
    },
    /**
     * 迁徙效果(曲线)
     * @param viewer
     */
    async birdMigrate(viewer) {
      // 定位视角
      this.viewer.camera.flyTo({
        destination: this.Cesium.Cartesian3.fromDegrees(
          113.277178,
          23.137995,
          20000.0
        )
      });
      let dataList;
      await this.$axios("./static/json/data.json").then(res => {
        dataList = res.data;
      });
      // 处理数据
      let data = [];
      for (let i = 0; i < dataList.length; i++) {
        let start = [113.277178, 23.137995];
        let end = dataList[i].coordinates;
        let dataItem = {};
        dataItem.from = { lng: start[0], lat: start[1] };
        dataItem.count = dataList[i].number;
        dataItem.to = { lng: end[0], lat: end[1] };
        data.push(dataItem);
      }
      this.migrate = new Migrate(this.viewer, data);
    },
    change(id) {
      this.clear();
      if (this.selectBotton === id) {
        this.selectBotton = null;
        return;
      }
      this.selectBotton = id;
      switch (id) {
        case "carTrajectory":
          this.trajectory(); // 车辆运行轨迹
          break;
        case "dynamicWall":
          this.drawWall(this.viewer);
          break;
        case "diffusionCircle":
          this.drawEllipse(this.viewer);
          break;
        case "clear":
          this.clear();
          break;
        case "migrate":
          this.birdMigrate();
          break;
        case "three":
          this.initThrees();
          break;
        case "drawSector":
          this.drawSector(this.viewer);
          break;

        default:
          break;
      }
    },
    clear() {
      this.viewer.dataSources.removeAll();
      this.viewer.entities.removeById("diffusionCircle");
      this.viewer.entities.removeById("dynamicWall");
      this.viewer.entities.removeById("dynamicSector");
      if (this.migrate) {
        this.migrate.isShowOrHidden("hide");
      }
      addThree.clear();
    }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.Cesium = Cesium;
    this.Cesium.Ion.defaultAccessToken = this.token;
    this.viewer = new this.Cesium.Viewer("cesiumContainer", {
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
      navigationInstructionsInitiallyVisible: false
    });
    this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0));

    this.viewer.imageryLayers.addImageryProvider(
      new this.Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=594daef2db6509d78ea6d9601ce7ce4d",
        layer: "tdtImgBasicLayer",
        style: "default",
        format: "image/jpeg",
        show: false
      })
    );
    this.viewer.imageryLayers.addImageryProvider(
      new this.Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=594daef2db6509d78ea6d9601ce7ce4d",
        layer: "tdtImgAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      })
    );

    this.viewer.terrainProvider = this.Cesium.createWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true
    });
    // 打开地形
    // this.viewer.scene.globe.depthTestAgainstTerrain = true

    // this.viewer._cesiumWidget._creditContainer.style.display = 'none'
    // 定位视角
    this.viewer.camera.flyTo({
      destination: this.Cesium.Cartesian3.fromDegrees(
        113.35694,
        21.94588,
        172415
      ),
      orientation: {
        heading: this.Cesium.Math.toRadians(0), // 方向
        pitch: this.Cesium.Math.toRadians(-55), // 倾斜角度
        roll: this.Cesium.Math.toRadians(0)
      },
      duration: 1.5 // 动画持续时间
      // complete: function(){ //飞行完毕后执行的动作

      // }
    });
    this.$axios.get("../../../../static/json/gz.json").then(res => {
      let features = res.data.features;
      let positionArray = [];
      // 获取区域的经纬度坐标
      for (let i = 0; i < features[0].geometry.coordinates[0][0].length; i++) {
        let coor = features[0].geometry.coordinates[0][0][i];
        positionArray.push(coor[0]);
        positionArray.push(coor[1]);
      }
      let polygonEntity = new this.Cesium.Entity({
        polygon: {
          hierarchy: {
            // 添加外部区域为1/4半圆，设置为180会报错
            positions: this.Cesium.Cartesian3.fromDegreesArray([
              0,
              0,
              0,
              90,
              179,
              90,
              179,
              0
            ]),
            // 中心挖空的“洞”
            holes: [
              {
                positions: this.Cesium.Cartesian3.fromDegreesArray(
                  positionArray
                )
              }
            ]
          },
          material: new this.Cesium.Color(
            15 / 255.0,
            38 / 255.0,
            84 / 255.0,
            0.7
          )
        }
      });
      // 边界线
      let lineEntity = new this.Cesium.Entity({
        polyline: {
          positions: this.Cesium.Cartesian3.fromDegreesArray(positionArray),
          width: 5,
          material: this.Cesium.Color.YELLOW
        }
      });

      this.viewer.entities.add(polygonEntity);
      this.viewer.entities.add(lineEntity);
    });
    this.init(); // 初始化
  }
};
</script>

<style lang="less">
@import "../../../style/popup.css";
.content {
  height: 100%;
  position: relative;
  .container-integrate {
    height: 100%;
    width: 100%;
    #cesiumContainer {
      height: 100%;
      width: 100%;
    }
  }
  .toolBox {
    position: absolute;
    top: 50px;
    left: 50px;
  }
  /*设置cesium和three的画布位置*/
  .container-integrate canvas {
    position: absolute;
    top: 0;
  }
  /*three画布禁止鼠标操作*/
  .container-integrate canvas:nth-child(3) {
    pointer-events: none;
  }
  .selectBotton {
    color: #fff;
    background-color: #228de9;
  }
}
</style>
