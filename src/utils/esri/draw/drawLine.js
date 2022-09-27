/*
 * @Descripttion: drawLine
 * @Author: licheng
 * @Date: 2021-11-19 18:02:57
 * @LastEditors: licheng
 * @LastEditTime: 2022-02-18 15:03:59
 */
import store from '@/store'

let path = []
const drawLine = {
  Draw () {
    let view = store.state.view
    let _this = this
    const draw = new window.ESRI.Draw({
      view: view
    })
    const action = draw.create('polyline')
    action.on(
      [
        'vertex-add',
        'vertex-remove',
        'cursor-update',
        'redo',
        'undo',
        'draw-complete'
      ],
      function (event) {
        // eslint-disable-next-line no-useless-call
        _this.updateVertices.call(_this, event)
      }
    )
  },
  // 线段更新
  updateVertices (event) {
    if (event.vertices.length > 1) {
      const result = this.createGraphic(event)
      if (result.selfIntersects) {
        // 三维场景下失效，感觉是个bug
        event.preventDefault()
      }
    }
  },
  // 创建绘制图层
  createGraphic (event) {
    let view = store.state.view
    // const vertices = event.vertices
    const vertices = event.vertices.map(x => {
      return [x[0], x[1]]
    })
    path = vertices
    view.graphics.removeAll()
    const graphic = new window.ESRI.Graphic({
      geometry: {
        type: 'polyline',
        paths: vertices,
        spatialReference: view.spatialReference
      },
      symbol: {
        type: 'simple-line',
        color: [4, 90, 141],
        width: 4,
        cap: 'round',
        join: 'round'
      }
    })
    const intersectingSegment = this.getIntersectingSegment(graphic.geometry)
    if (intersectingSegment) {
      view.graphics.addMany([graphic, intersectingSegment])
    } else {
      view.graphics.add(graphic)
    }
    return {
      selfIntersects: intersectingSegment
    }
  },
  getIntersectingSegment (polyline) {
    if (this.isSelfIntersecting(polyline)) {
      return new window.ESRI.Graphic({
        geometry: this.getLastSegment(polyline),
        symbol: {
          type: 'simple-line', // autocasts as new SimpleLineSymbol
          style: 'short-dot',
          width: 3.5,
          color: 'yellow'
        }
      })
    }
    return null
  },
  // 判断是否是自相交
  isSelfIntersecting (polyline) {
    if (polyline.paths[0].length < 3) {
      return false
    }
    const line = polyline.clone()
    const lastSegment = this.getLastSegment(polyline)
    line.removePoint(0, line.paths[0].length - 1)
    return window.ESRI.geometryEngine.crosses(lastSegment, line)
  },
  // 获取最后绘制的线段
  getLastSegment (polyline) {
    let view = store.state.view
    const line = polyline.clone()
    const lastXYPoint = line.removePoint(0, line.paths[0].length - 1) // 获取并移出最后绘制的点
    const existingLineFinalPoint = line.getPoint(0, line.paths[0].length - 1)
    return {
      type: 'polyline',
      spatialReference: view.spatialReference,
      hasZ: false,
      paths: [
        [
          [existingLineFinalPoint.x, existingLineFinalPoint.y],
          [lastXYPoint.x, lastXYPoint.y]
        ]
      ]
    }
  },
  // 折现平滑处理
  bezierSpline () {
    let view = store.state.view
    // eslint-disable-next-line no-undef
    var line = turf.lineString(path)
    // eslint-disable-next-line no-undef
    var curved = turf.bezierSpline(line)
    const graphic = new window.ESRI.Graphic({
      geometry: {
        type: 'polyline',
        paths: curved.geometry.coordinates,
        spatialReference: view.spatialReference
      },
      symbol: {
        type: 'simple-line',
        color: [194, 130, 188],
        width: 4,
        cap: 'round',
        join: 'round'
      }
    })
    view.graphics.add(graphic)
  }
}
export default drawLine
