/*
 * @Descripttion: drawPoint
 * @Author: licheng
 * @Date: 2021-11-19 18:02:57
 * @LastEditors: licheng
 * @LastEditTime: 2022-09-20 15:27:52
 */
import store from "@/store";

let point = [];
const drawPoint = {
  Draw() {
    let view = store.state.view;
    let _this = this;
    const draw = new window.ESRI.Draw({
      view: view
    });
    const action = draw.create("point");
    action.on(["draw-complete"], function(event) {
      _this.createGraphic(event.coordinates);
    });
  },
  // 创建绘制图层
  createGraphic(coordinates) {
    let view = store.state.view;
    let point = {
      type: "point", // autocasts as /Point
      x: coordinates[0],
      y: coordinates[1],
      spatialReference: view.spatialReference
    };
    view.graphics.removeAll();
    const graphic = new window.ESRI.Graphic({
      geometry: point,
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: "red",
        size: "16px",
        outline: {
          color: [255, 255, 0],
          width: 3
        }
      }
    });
    view.graphics.add(graphic);
    this.geoprocessor(graphic);
  },
  //请求gp服务
  geoprocessor(graphic) {
    const graphicsLayer = store.state.view.map.findLayerById("heightLayer");
    const gpUrl =
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed";
    const fillSymbol = {
      type: "simple-fill",
      color: [226, 119, 40, 0.75],
      outline: {
        color: [255, 255, 255],
        width: 1
      }
    };
    const options = {
      outSpatialReference: {
        wkid: 102100
      }
    };
    const inputGraphicContainer = [];
    inputGraphicContainer.push(graphic);
    const featureSet = new window.ESRI.FeatureSet();
    featureSet.features = inputGraphicContainer;
    const vsDistance = new window.ESRI.LinearUnit();
    vsDistance.distance = 5;
    vsDistance.units = "miles";
    const params = {
      Input_Observation_Point: featureSet,
      Viewshed_Distance: vsDistance
    };
    window.ESRI.geoprocessor.execute(gpUrl, params, options).then(result => {
      const resultFeatures = result.results[0].value.features;
      const viewshedGraphics = resultFeatures.map(feature => {
        feature.symbol = fillSymbol;
        return feature;
      });
      graphicsLayer.addMany(viewshedGraphics);
    });
  }
};
export default drawPoint;
