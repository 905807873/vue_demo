/*
 * @Descripttion: project
 * @Author: licheng
 * @Date: 2021-11-08 15:11:02
 * @LastEditors: licheng
 * @LastEditTime: 2021-12-07 14:04:23
 */
class Popup {
  constructor (info) {
    this.id = 0
    // 如果有div就移除
    if (document.getElementsByClassName('bx-popup-ctn').length > 0) {
      document.getElementsByClassName('bx-popup-ctn').remove()
    }
    this.viewer = info.viewer // 弹窗创建的viewer
    this.geometry = info.geometry // 弹窗挂载的位置
    // eslint-disable-next-line no-proto
    this.id = 'popup_' + this.__proto__.id++
    this.ctn = document.createElement('div')
    this.ctn.classList.add('bx-popup-ctn')
    this.ctn.id = this.id
    this.viewer.container.append(this.ctn)
    // 创建Html
    this.ctn.innerHTML = this.createHtml(info.name, info.properties)
    this.render(this.geometry)
    // 添加监听拖动重新渲染位置
    this.eventListener = this.viewer.clock.onTick.addEventListener(clock => {
      this.render(this.geometry)
    })
    // 绑定关闭事件
    document.getElementsByClassName(
      'leaflet-popup-close-button'
    )[0].onclick = () => {
      this.close()
    }
  }
  // 渲染位置
  render (geometry) {
    // eslint-disable-next-line no-undef
    var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      geometry
    )
    this.ctn.style.left = position.x - this.ctn.offsetWidth / 2 + 'px'
    this.ctn.style.top = position.y - this.ctn.offsetHeight - 55 + 'px'
  }
  createHtml (header, content) {
    var html =
      '<div class="bx-popup-header-ctn">' +
      header +
      '<span class="leaflet-popup-close-button" ><i class="el-icon-close"></i></span>' +
      '</div>' +
      '<div class="bx-popup-content-ctn" >' +
      '<div class="bx-popup-content" >' +
      this.createTable(content) +
      '</div>' +
      '</div>' +
      '<div class="bx-popup-tip-container" >' +
      '<div class="bx-popup-tip" >' +
      '</div>' +
      '</div>'
    return html
  }
  createTable (content) {
    let html = '<table class="table-popup">'
    for (let key in content) {
      html += `<tr><td class="title-popup">${key}</td>
           <td class="value-popup">${content[key]}</td></tr>`
    }
    html += '</table>'
    return html
  }
  close () {
    this.ctn.remove()
    this.viewer.clock.onTick.removeEventListener(this.eventListener)
  }
}
export default Popup
