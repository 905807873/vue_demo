/*
 * @Descripttion: 添加threejs模型
 * @Author: licheng
 * @Date: 2021-12-22 17:41:13
 * @LastEditors: licheng
 * @LastEditTime: 2022-01-05 10:20:29
 */
var _this = this
var three = {
  renderer: null,
  camera: null,
  scene: null
}
var minWGS84 = [113.177178, 23.037995]
var maxWGS84 = [113.377178, 23.23799]
var objects = []
export default {
  viewer: null,
  initThree (viewer) {
    this.viewer = viewer
    let fov = 45
    let width = window.innerWidth
    let height = window.innerHeight
    let aspect = width / height
    let near = 1
    let far = 10 * 1000 * 1000
    three.scene = new THREE.Scene()
    three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    three.renderer = new THREE.WebGLRenderer({ alpha: true })
    let Amlight = new THREE.AmbientLight(0xffffff, 2)
    three.scene.add(Amlight)
    // 注意这里，直接把three容器（canvas 添加到 cesium中，在cesium的canvas之下），
    // 这样的话，两个canvas才会重叠起来。
    if (this.viewer.cesiumWidget.canvas.parentElement.getElementsByTagName('canvas').length >1) {
      this.viewer.cesiumWidget.canvas.parentElement.getElementsByTagName('canvas')[1].remove()
    }
    this.viewer.cesiumWidget.canvas.parentElement.appendChild(
      three.renderer.domElement
    )
    // ThreeContainer.appendChild(three.renderer.domElement);
    this.init3DObject()
    this.loop()
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        113.277178,
        23.137995,
        200000.0
      )
    })
  },
  init3DObject () {
    function _3DObject () {
      this.threeMesh = null // Three.js 3DObject.mesh
      this.minWGS84 = null // location bounding box
      this.maxWGS84 = null
    }
    let geometry = new THREE.DodecahedronGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
    let dodecahedronMesh = new THREE.Mesh(geometry, material)
    // let dodecahedronMesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
    dodecahedronMesh.scale.set(5000, 5000, 5000) // scale object to be visible at planet scale
    dodecahedronMesh.position.z += 25000.0 // translate "up" in Three.js space so the "bottom" of the mesh is the handle
    dodecahedronMesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system
    let dodecahedronMeshYup = new THREE.Group()
    dodecahedronMeshYup.add(dodecahedronMesh)
    three.scene.add(dodecahedronMeshYup) // don’t forget to add it to the Three.js scene manually
    // Assign Three.js object mesh to our object array
    let _3DOB = new _3DObject()
    _3DOB.threeMesh = dodecahedronMeshYup
    _3DOB.minWGS84 = minWGS84
    _3DOB.maxWGS84 = maxWGS84
    objects.push(_3DOB)
  },
  renderThreeObj () {
    // register Three.js scene with Cesium
    three.camera.fov = Cesium.Math.toDegrees(this.viewer.camera.frustum.fovy) // ThreeJS FOV is vertical
    // three.camera.updateProjectionMatrix();
    let cartToVec = function (cart) {
      return new THREE.Vector3(cart.x, cart.y, cart.z)
    }

    // Configure Three.js meshes to stand against globe center position up direction
    for (let id in objects) {
      minWGS84 = objects[id].minWGS84
      maxWGS84 = objects[id].maxWGS84
      // convert lat/long center position to Cartesian3
      let center = Cesium.Cartesian3.fromDegrees(
        (minWGS84[0] + maxWGS84[0]) / 2,
        (minWGS84[1] + maxWGS84[1]) / 2
      )
      // get forward direction for orienting model
      let centerHigh = Cesium.Cartesian3.fromDegrees(
        (minWGS84[0] + maxWGS84[0]) / 2,
        (minWGS84[1] + maxWGS84[1]) / 2,
        1
      )
      // use direction from bottom left to top left as up-vector
      let bottomLeft = cartToVec(
        Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1])
      )
      let topLeft = cartToVec(
        Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1])
      )
      let latDir = new THREE.Vector3()
        .subVectors(bottomLeft, topLeft)
        .normalize()
      // configure entity position and orientation
      objects[id].threeMesh.position.copy(center)
      objects[id].threeMesh.lookAt(centerHigh.x, centerHigh.y, centerHigh.z)
      objects[id].threeMesh.up.copy(latDir)
    }
    // Clone Cesium Camera projection position so the
    // Three.js Object will appear to be at the same place as above the Cesium Globe
    three.camera.matrixAutoUpdate = false
    let cvm = this.viewer.camera.viewMatrix
    let civm = this.viewer.camera.inverseViewMatrix

    // 注意这里，经大神博客得知，three高版本这行代码需要放在 three.camera.matrixWorld 之前
    three.camera.lookAt(0, 0, 0)

    three.camera.matrixWorld.set(
      civm[0],
      civm[4],
      civm[8],
      civm[12],
      civm[1],
      civm[5],
      civm[9],
      civm[13],
      civm[2],
      civm[6],
      civm[10],
      civm[14],
      civm[3],
      civm[7],
      civm[11],
      civm[15]
    )

    three.camera.matrixWorldInverse.set(
      cvm[0],
      cvm[4],
      cvm[8],
      cvm[12],
      cvm[1],
      cvm[5],
      cvm[9],
      cvm[13],
      cvm[2],
      cvm[6],
      cvm[10],
      cvm[14],
      cvm[3],
      cvm[7],
      cvm[11],
      cvm[15]
    )

    // 设置three宽高
    let width = document.getElementById('cesiumContainer').clientWidth
    let height = document.getElementById('cesiumContainer').clientHeight

    let aspect = width / height
    three.camera.aspect = aspect
    three.camera.updateProjectionMatrix()
    three.renderer.setSize(width, height)
    three.renderer.clear()
    three.renderer.render(three.scene, three.camera)
  },
  loop () {
    requestAnimationFrame(_this.a.loop)
    _this.a.renderThreeObj()
  },
  clear () {
    if (three.scene) {
      three.scene.clear()
    }
  }

}
