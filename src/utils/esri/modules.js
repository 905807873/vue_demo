/*
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-30 10:21:39
 * @LastEditors: licheng
 * @LastEditTime: 2021-11-30 14:19:19
 */
import store from '@/store'
import { loadModules } from 'esri-loader'
var ESRI = []
let importModules = [
  'esri/rest/identify',
  'esri/rest/support/IdentifyParameters'
]
let EsriModules = importModules.map(x => {
  return x.split('/')[x.split('/').length - 1]
})
loadModules(importModules).then(arr => {
  for (let i = 0; i < arr.length; i++) {
    ESRI[EsriModules[i]] = arr[i]
  }
})

let Identify = function (url, obj, callback) {
  let view = store.state.view
  let params = new ESRI.IdentifyParameters()
  params.tolerance = obj.tolerance || 3
  params.geometry = obj.geometry
  params.mapExtent = view.extent
  params.layerIds = obj.layerIds || 'all'
  params.layerOption = obj.layerOption || 'top'
  ESRI.identify.identify(url, params).then(x => {
    callback(x.results)
  })
}

export default { Identify }
