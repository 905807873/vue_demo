/*
 * @Descripttion: drawPoly
 * @Author: licheng
 * @Date: 2021-11-19 18:02:57
 * @LastEditors: licheng
 * @LastEditTime: 2022-09-20 18:00:39
 */
import store from "@/store";

let path = [];
const drawPoly = {
  Draw() {
    let view = store.state.view;
    let _this = this;
    let draw = new window.ESRI.Draw({
      view: view
    });
    let action = draw.create("polygon", {
      mode: "click" //点击方式加点
    });
    action.on(["vertex-remove", "cursor-update", "draw-complete"], function(
      evt
    ) {
      _this.createPolygonGraphic(evt);
    });
  },
  createPolygonGraphic(evt) {
    let view = store.state.view;
    view.graphics.removeAll(); //两点画矩形
    if (evt.vertices.length < 2) {
      return;
    }
    var rings = [
      evt.vertices[0],
      [evt.vertices[0][0], evt.vertices[1][1], 0],
      evt.vertices[1],
      [evt.vertices[1][0], evt.vertices[0][1], 0]
    ];
    let polygon = {
      type: "polygon", // autocasts as Polygon
      rings: [rings],
      spatialReference: view.spatialReference
    };
    let graphic = new window.ESRI.Graphic({
      geometry: polygon
    });
    view.graphics.add(graphic);
    if (evt.type == "draw-complete") {
      let sliceWidget = new window.ESRI.Slice({
        view: view
      });
      this.sliceWidget = sliceWidget;
      sliceWidget.viewModel.shape = new window.ESRI.SlicePlane({
        position: {
          x: graphic.geometry.extent.center.x,
          y: graphic.geometry.extent.center.y,
          z: -200,
          spatialReference: view.spatialReference
        },
        width: graphic.geometry.extent.width,
        height: graphic.geometry.extent.height,
        heading: 0
      });
      view.graphics.removeAll();
      this.createBox(graphic);
    }
  },
  createBox(graphic) {
    let extent = graphic.geometry.extent;
    let view = store.state.view;
    let point = graphic.geometry.extent.center;
    let widthWest = 0.2;
    let pt = new window.ESRI.Point({
      x: point.x,
      y: point.y,
      z: -200,
      spatialReference: view.spatialReference
    });
    let meshTextureByUrl = new window.ESRI.MeshTexture({
      url: "./static/images/meshBox.bmp"
    });
    //底部
    let trunk1 = window.ESRI.Mesh.createBox(pt, {
      size: {
        width: extent.width,
        depth: extent.height,
        height: 0.2
      },
      material: {
        colorTexture: meshTextureByUrl
      }
    });
    trunk1.offset(0, 0, -200);
    //左
    let trunk2 = window.ESRI.Mesh.createBox(pt, {
      size: {
        width: 0.2,
        depth: extent.height,
        height: 200 + 200
      },
      material: {
        colorTexture: meshTextureByUrl
      }
    });
    trunk2.offset(-(extent.width / 2), 0, -200);

    //右
    let trunk3 = window.ESRI.Mesh.createBox(pt, {
      size: {
        width: 0.2,
        depth: extent.height,
        height: 200 + 200
      },
      material: {
        colorTexture: meshTextureByUrl
      }
    });
    trunk3.offset(extent.width / 2, 0, -200);

    //前
    let trunk4 = window.ESRI.Mesh.createBox(pt, {
      size: {
        width: extent.width,
        depth: 0.2,
        height: 200 + 200
      },
      material: {
        colorTexture: meshTextureByUrl
      }
    });
    trunk4.offset(0, extent.height / 2, -200);

    //后
    let trunk5 = window.ESRI.Mesh.createBox(pt, {
      size: {
        width: extent.width,
        depth: 0.2,
        height: 200 + 200
      },
      material: {
        colorTexture: meshTextureByUrl
      }
    });
    trunk5.offset(0, -(extent.height / 2), -200);

    let geometry = window.ESRI.meshUtils.merge([
      trunk1,
      trunk2,
      trunk3,
      trunk4,
      trunk5
    ]);
    let graphicLayer = view.map.findLayerById("mergeGraphicsLayer");
    graphicLayer.graphics.add(
      new window.ESRI.Graphic({
        geometry: geometry,
        symbol: {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill"
            }
          ]
        }
      })
    );
  },
  clear() {
    this.sliceWidget.viewModel.clear();
  }
};
export default drawPoly;
