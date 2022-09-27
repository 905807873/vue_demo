/*
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-30 10:21:39
 * @LastEditors: licheng
 * @LastEditTime: 2022-09-20 17:42:21
 */
import store from "@/store";
import { loadModules } from "esri-loader";
window.ESRI = [];
let importModules = [
  "esri/Map",
  "esri/views/MapView",
  "esri/views/SceneView",
  "esri/WebScene",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/geometry/Geometry",
  "esri/layers/SceneLayer",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/support/LabelClass",
  "esri/layers/WebTileLayer",
  "esri/rest/identify",
  "esri/rest/support/IdentifyParameters",
  "esri/identity/IdentityManager",
  "esri/layers/BuildingSceneLayer",
  "esri/geometry/Polygon",
  "esri/geometry/geometryEngine",
  "esri/views/2d/layers/BaseLayerView2D",
  "esri/core/Handles",
  "esri/geometry/projection",
  "esri/core/reactiveUtils",
  "esri/layers/Layer",
  "esri/views/draw/Draw",
  "esri/widgets/Slice",
  "esri/analysis/SlicePlane",
  "esri/geometry/Point",
  "esri/geometry/Mesh",
  "esri/geometry/support/meshUtils",
  "esri/geometry/support/MeshTexture",
  "esri/rest/geoprocessor",
  "esri/rest/support/LinearUnit",
  "esri/rest/support/FeatureSet"
];
let EsriModules = importModules.map(x => {
  return x.split("/")[x.split("/").length - 1];
});
loadModules(importModules).then(arr => {
  for (let i = 0; i < arr.length; i++) {
    window.ESRI[EsriModules[i]] = arr[i];
  }
});

const Identify = function(url, obj, callback) {
  let view = store.state.view;
  let params = new window.ESRI.IdentifyParameters();
  params.tolerance = obj.tolerance || 3;
  params.geometry = obj.geometry;
  params.mapExtent = view.extent;
  params.layerIds = obj.layerIds || "all";
  params.layerOption = obj.layerOption || "top";
  window.ESRI.identify.identify(url, params).then(x => {
    callback(x.results);
  });
};

export default { Identify };
