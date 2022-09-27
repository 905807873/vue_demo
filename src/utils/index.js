/*
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-19 18:02:57
 * @LastEditors: licheng
 * @LastEditTime: 2022-02-16 17:07:21
 */
import store from '@/store'
import modules from './esri/modules'

let event
const utils = {
  Identify (callback) {
    let view = store.state.view
    // eslint-disable-next-line no-unused-vars
    let layers = view.map.allLayers.items.filter(x => x.id !== 'DT')
    // eslint-disable-next-line no-unused-vars
    event = view.on('click', e => {
      modules.Identify(
        // layers[0].url,
        layers[0].url.slice(0, 54) + 'MapServer',
        {
          tolerance: 3,
          geometry: e.mapPoint
        },
        callback
      )
    })
  },
  removeEventListener () {
    event.remove()
  }
}
export default utils
