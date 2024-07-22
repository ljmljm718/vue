<template>
  <div id="mapDom" class="w-[100vw] h-[100vh]"></div>
</template>
<script setup lang="ts">
import * as Cesium from 'cesium'
import { TdtImageryProvider } from '@cesium-china/cesium-map'

// @ts-ignore
window.Cesium = Cesium
console.log('Cesium', Cesium)

const token = '7eb5c1eba47d10073b06a4bb8d5a1e3c'
// 服务域名
const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
// 服务负载子域
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

const initMap = async () => {
  console.log('初始化服务')
  const viewer = new Cesium.Viewer('mapDom', {
    animation: false,
    shouldAnimate: true, //是否允许动画
    selectionIndicator: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    showRenderLoopErrors: false,
    shadows: false,
    baseLayerPicker: false // 关闭图层选择器，因为我们只使用天地图
    // terrainProvider: await Cesium.createWorldTerrainAsync(), // 需要外网，暂不支持
  })

  const container = viewer.cesiumWidget.creditContainer as HTMLElement
  container.style.display = 'none'

  // 抗锯齿
  // viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled = false
  // 水雾特效
  viewer.scene.globe.showGroundAtmosphere = true
  // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
  // viewer.scene.screenSpaceCameraController.constrainedPitch = Cesium.Math.toRadians(-20);
  // viewer.scene.screenSpaceCameraController.autoResetHeadingPitch = false;
  viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    Cesium.CameraEventType.RIGHT_DRAG,
    Cesium.CameraEventType.WHEEL,
    Cesium.CameraEventType.PINCH
  ]
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    Cesium.CameraEventType.MIDDLE_DRAG,
    Cesium.CameraEventType.PINCH,
    {
      eventType: Cesium.CameraEventType.LEFT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL
    },
    {
      eventType: Cesium.CameraEventType.RIGHT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL
    }
  ]
  // 取消默认的双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  )

  // 叠加影像服务
  const imgMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18
  })
  viewer.imageryLayers.addImageryProvider(imgMap)

  // 叠加国界服务
  const iboMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 10
  })
  viewer.imageryLayers.addImageryProvider(iboMap)

  // 叠加地形服务
  const terrainUrls: Array<any> = []

  for (var i = 0; i < subdomains.length; i++) {
    var url = tdtUrl.replace('{s}', subdomains[i]) + 'mapservice/swdx?T=elv_c&tk=' + token
    terrainUrls.push(url)
  }

  //   viewer.imageryLayers.add(new Cesium.ImageryLayer(new TdtImageryProvider({
  //     style: 'vec', //style: vec、cva、img、cia、ter
  //     key: token // 需去相关地图厂商申请
  //   })))

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.89, 8850000),
    orientation: {
      heading: Cesium.Math.toRadians(360),
      pitch: Cesium.Math.toRadians(-85),
      roll: Cesium.Math.toRadians(0)
    },
    duration: 0,
    complete: function callback() {
      // 定位完成之后的回调函数
    }
  })

  // 将三维球定位到中国
  setTimeout(() => {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.39, 39.89, 2850),
      orientation: {
        heading: Cesium.Math.toRadians(360),
        pitch: Cesium.Math.toRadians(-65),
        roll: Cesium.Math.toRadians(0)
      },
      complete: function callback() {
        // 定位完成之后的回调函数
      }
    })
  }, 3000)
}
onMounted(() => {
  initMap()
})
</script>
