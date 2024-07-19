<template>
  <div
    id="mapDom"
    class="w-[100vw] h-[100vh]"
  ></div>
</template>
<script setup lang="ts">
import * as Cesium from 'cesium'
import { generateUUID } from '@/utils/index'
import {
    TdtImageryProvider
} from '@cesium-china/cesium-map'
import { flattenDepth } from 'lodash-es';

// @ts-ignore
window.Cesium = Cesium

const token = '7eb5c1eba47d10073b06a4bb8d5a1e3c'
// 服务域名
// const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
const tdtUrl = 'http://127.0.0.1:8888/'
// 服务负载子域
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
let viewer:any = null

let viewEntities:Array<any> = []


const createPloygon = (_viewer, polylinePoints:Array<Array<any>>, option = {}) => {
  if (!_viewer) return;
  const hierarchyPositionArr = flattenDepth(polylinePoints)
  viewEntities.push(
    _viewer.entities.add({
      id: generateUUID(),
      polygon: {
        // 获取指定属性（positions，holes（图形内需要挖空的区域））
        hierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArray(hierarchyPositionArr),
          // holes: [{
          //   positions: Cesium.Cartesian3.fromDegreesArray([
          //     119, 32,
          //     115, 34,
          //     119, 40
          //   ])
          // }]
        },
        // 边框
        outline: true,
        // 边框颜色
        outlineColor: Cesium.Color.WHITE,
        // 边框尺寸
        outlineWidth: 2,
        // 填充的颜色，withAlpha透明度
        material: Cesium.Color.GREEN.withAlpha(0.5),
        // 是否被提供的材质填充
        fill: true,
        // 恒定高度
        height: 5,
        // 显示在距相机的距离处的属性，多少区间内是可以显示的
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000000),
        // 是否显示
        show: true,
        // 顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
        zIndex: 10
      }
    })
  )
}

const createPoint = (
  _viewer,
  position,
  option = {}
) => {
  const [longitude, latitude, height = 10] = position
  if (!_viewer || !longitude || !latitude) return;
  const point = Object.assign({
    // 点的大小（像素）
    pixelSize: 15,
    // 点位颜色，fromCssColorString 可以直接使用CSS颜色
    color: Cesium.Color.fromCssColorString('#84adea'),
    // 边框颜色
    outlineColor: Cesium.Color.fromCssColorString('#fff'),
    // 边框宽度(像素)
    outlineWidth: 2,
    // 显示在距相机的距离处的属性，多少区间内是可以显示的
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000),
    // 是否显示
    show: true
  }, option)
  viewEntities.push(_viewer.entities.add({
    id: generateUUID(),
    position: Cesium.Cartesian3.fromDegrees(
      Cesium.Math.toDegrees(longitude),
      Cesium.Math.toDegrees(latitude),
      height
    ),
    point
  }))
}

const createText = (_viewer, position, text = '', _option = {}) => {
  const [longitude, latitude, height = 10] = position
  if (!_viewer || !longitude || !latitude) return;
  const option = Object.assign({
    pointColor: Cesium.Color.RED,
    pointSize: 10,
    textColor: Cesium.Color.BLACK,
    backColor: Cesium.Color.WHITE, // 字体背景色
    showBackground: true,
    textOutLine: true,
    textOutLineColor: Cesium.Color.WHITE
  }, _option)
  viewEntities.push(_viewer.entities.add({
    id: generateUUID(),
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
    // 点
    point: {
      color: option.pointColor, // 点位颜色
      pixelSize: option.pointSize // 像素点大小
    },
    // 文字
    label: {
      // 文本。支持显式换行符“ \ n”
      text,
      // 字体样式，以CSS语法指定字体
      font: '14pt Source Han Sans CN',
      // 字体颜色
      fillColor: option.textColor,
      // 背景颜色
      backgroundColor: option.backColor,
      // 是否显示背景颜色
      showBackground: option.showBackground,
      // 字体边框
      outline: option.textOutLine,
      // 字体边框颜色
      outlineColor: option.textOutLineColor,
      // 字体边框尺寸
      outlineWidth: 10,
      // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
      scale: 1.0,
      // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      // 相对于坐标的水平位置
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      // 相对于坐标的水平位置
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
      pixelOffset: new Cesium.Cartesian2(0, -20),
      // 显示在距相机的距离处的属性，多少区间内是可以显示的
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 150000),
      // 是否显示
      show: true
    }
  }))
}

const initMap = async () => {
  console.log('初始化服务')
  viewer = new Cesium.Viewer('mapDom', {
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
    baseLayerPicker: false, // 关闭图层选择器，因为我们只使用天地图
    // terrainProvider: await Cesium.createWorldTerrainAsync(), // 需要外网，暂不支持
  })

  const container = viewer.cesiumWidget.creditContainer as HTMLElement
  container.style.display = "none";

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

  // 鼠标单击事件
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  const leftClick = Cesium.ScreenSpaceEventType.LEFT_CLICK;
  viewer.screenSpaceEventHandler.removeInputAction(leftClick);
  handler.setInputAction((e) => {
    const pick = viewer.scene.pick(e.position)
    if (pick && pick.id) {
      // 点击后删除这个实体
      const _selectedEntity = viewEntities.find(item => (item.id === pick.id.id))
      if (_selectedEntity) {
        viewer.entities.remove(_selectedEntity)
        viewEntities = viewEntities.filter(item => (item.id !== pick.id.id))
      }
      return
    }
    const cartesian = viewer.camera.pickEllipsoid(
      e.position,
      viewer.scene.globe.ellipsoid
    );
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    navigator.clipboard.writeText(`[${longitude}, ${latitude}],`);
    createText(viewer, [longitude, latitude], '中国有句古话')
  }, leftClick)
  
  createPloygon(viewer, [
    [116.385847876651, 39.9210402682383],
    [116.38588586818327, 39.91791209924505],
    [116.38602487924092, 39.91528994215974],
    [116.38630297230759, 39.91349316819115],
    [116.38631477702901, 39.91201137488362],
    [116.3895384976908, 39.91198656412521],
    [116.39341037100495, 39.9121609191357],
    [116.39585409430356, 39.91231985723424],
    [116.39563952946072, 39.916049640551165],
    [116.39548628069143, 39.91909486756313],
    [116.39532922467104, 39.92160280388272],
    [116.39102396555478, 39.92161518252694],
    [116.38728552280215, 39.92144261525425],
    [116.38555726696232, 39.92133226820324],
  ])
}
onMounted(() => {
  initMap()
})
</script>
