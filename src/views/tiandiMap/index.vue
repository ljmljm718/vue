<template>
  <div class="relative w-full h-full">
    <div id="mapDom" class="w-full h-full"></div>
    <div class="absolute z-36 right-[1rem] top-[1rem] p-2 bg-white hidden">
      <el-button type="primary" @click="enablePolygonEdit = true">开始绘制</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as Cesium from 'cesium'
import { generateUUID } from '@/utils/index'
import { TdtImageryProvider } from '@cesium-china/cesium-map'
import { flattenDepth } from 'lodash-es'
import request from '@/config/axios'
import * as turf from '@turf/turf'
import itemBG from './assets/item.png'
import itemBG1 from './assets/item1.png'
import innerBg from './assets/bg.png'
import titleBar from './assets/titleBar.png'


const getPlotAreaData = async (params: any) => {
  return await request.get({ url: `/agriculture/crop-base/farmOverviewPlotInfo`, params })
}

// @ts-ignore
window.Cesium = Cesium

const token = '7eb5c1eba47d10073b06a4bb8d5a1e3c'
// 服务域名
// const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
const tdtUrl = 'https://www.zhuangbeizz.cn/tiandi/'
// 服务负载子域
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
let viewer: any = null

let viewEntities: Array<any> = []

// 绘制多边形， custom为true时，不添加到 viewEntities 中
const createPolygon = (_viewer = viewer, polylinePoints: Array<Array<any>>, option = {}, custom = false) => {
  if (!_viewer) return
  const hierarchyPositionArr = flattenDepth(polylinePoints, 3)
  const polygon = Object.assign(
    {
      // 获取指定属性（positions，holes（图形内需要挖空的区域））
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArray(hierarchyPositionArr)
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
      // material: Cesium.Color.GREEN.withAlpha(0.5),
      material: Cesium.Color.fromRandom({ alpha: 0.5 }),
      // 是否被提供的材质填充
      fill: true,
      // 恒定高度
      height: 15,
      // 显示在距相机的距离处的属性，多少区间内是可以显示的
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000000),
      // 是否显示
      show: true,
      // 顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
      zIndex: 10
    },
    option
  )
  const _entities = _viewer.entities.add({
    id: generateUUID(),
    polygon
  })
  if (!custom) viewEntities.push(_entities)
  return _entities
}

const createPoint = (_viewer, position, option = {}) => {
  const [longitude, latitude, height = 10] = position
  if (!_viewer || !longitude || !latitude) return
  const point = Object.assign(
    {
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
    },
    option
  )
  viewEntities.push(
    _viewer.entities.add({
      id: generateUUID(),
      position: Cesium.Cartesian3.fromDegrees(
        Cesium.Math.toDegrees(longitude),
        Cesium.Math.toDegrees(latitude),
        height
      ),
      point
    })
  )
}

const createText = (_viewer, position, text = '', _option = {}) => {
  const [longitude, latitude, height = 10] = position
  if (!_viewer || !longitude || !latitude) return
  const option = Object.assign(
    {
      showPoint: true,
      pointColor: Cesium.Color.RED,
      pointSize: 10,
      textColor: Cesium.Color.BLACK,
      backColor: Cesium.Color.WHITE, // 字体背景色
      showBackground: true,
      textOutLine: true,
      textOutLineColor: Cesium.Color.WHITE,
      labelDistanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 150000)
    },
    _option
  )
  viewEntities.push(
    _viewer.entities.add({
      id: generateUUID(),
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
      // 点
      point: {
        show: option.showPoint,
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
        distanceDisplayCondition: option.labelDistanceDisplayCondition,
        // 是否显示
        show: true
      }
    })
  )
}

// 飞到某个地点
const flyTo = (
  _viewer = viewer,
  position,
  option = {
    orientation: {
      heading: Cesium.Math.toRadians(360),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0)
    },
  },
  callback = () => {}
) => {
  const [lng, lat, height] = position
  _viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
    ...option,
    complete: callback
  })
}

defineExpose({
  createPolygon,
  createPoint,
  createText,
  flyTo
})

let popupContainer:any = null
const createPopup = () => {
  popupContainer = document.createElement("div")
  popupContainer.style.position = 'absolute';
  popupContainer.style.display = 'none'
  viewer.cesiumWidget.container.appendChild(popupContainer)
}

const labelMap:Map<string, any> = new Map()
const getDataList = async () => {
  const res = await getPlotAreaData({});
  console.log("getDataList", res);
  if (!popupContainer) createPopup();
  viewer.camera.moveStart.addEventListener((movement) => {
    if (popupContainer) popupContainer.style.display = 'none'
  });
  labelMap.clear()
  if (Array.isArray(res)) {
    res.forEach(item => {
      const parkGeofencing = JSON.parse(item.parkGeofencing)
      if (Array.isArray(parkGeofencing) && parkGeofencing.length > 0) {
        const _posi = parkGeofencing[0].map(ele => ([ele.lng, ele.lat]))
        
        createPolygon(undefined, _posi, {
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(2000, 1000000),
        })

        const features = turf.points(_posi);
        const _POS_ = turf.center(features);
        const { geometry } = _POS_;
        const { coordinates } = geometry
        flyTo(
          undefined,
          [...coordinates, 1400]
        )
        viewer.entities.add({
          id: generateUUID(),
          name: item.parkName,
          label: {
            text: item.parkName,
            font: '500 30px Helvetica',// 15pt monospace
            scale: 0.6,
            style: Cesium.LabelStyle.FILL,
            fillColor: Cesium.Color.WHITE,
            pixelOffset: new Cesium.Cartesian2(0, -50), //偏移量
            showBackground: true,
            backgroundColor: new Cesium.Color(0.13, 0.29, 0.29, 1.0),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(2000, 5000),
          },
          position: Cesium.Cartesian3.fromDegrees(
            coordinates[0],
            coordinates[1],
            20
          ),
          billboard: {
            image: itemBG,
            scale: 1.0,
            horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(2000, 5000),
          }
        })
        
        flyTo(
          undefined,
          [...coordinates, 1400]
        )

        const childItem = item.plotList;
        if (Array.isArray(childItem)) {
          childItem.forEach(child => {
            const childGeofencing = JSON.parse(child.plotGeofencing);
            if (Array.isArray(childGeofencing) && childGeofencing.length > 0) {
              const childPos = childGeofencing[0].map(ele => ([ele.lng, ele.lat]))
              const createdPolygonItem = createPolygon(undefined, childPos, {
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000),
              })
              const features1 = turf.points(childPos);
              const _POS_1 = turf.center(features1);
              const { geometry: geometry1 } = _POS_1;
              const { coordinates: coordinates1 } = geometry1
              viewer.entities.add({
                id: generateUUID(),
                name: child.plotName,
                label: {
                  text: child.plotName,
                  font: '500 34px Helvetica',// 15pt monospace
                  scale: 0.6,
                  style: Cesium.LabelStyle.FILL,
                  fillColor: Cesium.Color.WHITE,
                  pixelOffset: new Cesium.Cartesian2(0, -50), //偏移量
                  showBackground: true,
                  backgroundColor: new Cesium.Color(0.13, 0.29, 0.29, 1.0),
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000),
                },
                position: Cesium.Cartesian3.fromDegrees(
                  coordinates1[0],
                  coordinates1[1],
                  20
                ),
                billboard: {
                  image: itemBG1,
                  scale: 1.0,
                  horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                  verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000),
                },
              });

              if (Array.isArray(child.plantList) && child.plantList.length > 0) {
                const plantItem = child.plantList[0]
                const buildArr = [
                  {
                    title: '作物名称',
                    value: plantItem.cropName
                  },
                  {
                    title: '地块面积',
                    value: plantItem.area
                  },
                  {
                    title: '物候期',
                    value: plantItem.growth
                  },
                  {
                    title: '预计产量',
                    value: plantItem.yield || '未知'
                  },
                  {
                    title: '开始种植时间',
                    value: plantItem.startTime
                  },
                  {
                    title: '预计收获时间',
                    value: plantItem.endTime
                  },
                ]
                const domTitle = child.plotName;
                const labelMapId = createdPolygonItem.id
                labelMap.set(labelMapId, {
                  position: Cesium.Cartesian3.fromDegrees(
                    coordinates1[0],
                    coordinates1[1],
                    20
                  ),
                  html: `
                    <div class="w-[360px] relative bottom-[60px] min-h-[270px] p-3">
                      <img src="${innerBg}" class="w-full h-full absolute left-0 top-0 z-0" />
                      <div class="py-[1.6rem] pb-[.6rem] pt-[1.6rem] w-full text-center relative z-10 text-[1.2rem]">${domTitle}</div>
                      <div class="grid grid-cols-2 gap-2 relative z-10 px-[1.3rem]">
                        ${
                          buildArr.map(_i => {
                            return `
                              <div class="p-3 py-1">
                                <div class="text-white">
                                  <img src=${titleBar} class="w-[.8rem] h-[.8rem]" />
                                  <span class="pl-[.3rem]">${_i.title}</span>
                                </div>
                                <div class="text-[#f1f1f1] pl-[1.3rem]">${_i.value}</div>
                              </div>
                            `
                          }).join("")
                        }
                      </div>
                    </div>
                  `
                })
              }
            }
          })
        }
      }
    })
  }
}

const enablePolygonEdit = ref<boolean>(false)
let tempPolygonIns: any = null
let tempPolyPositions: Array<any> = []
const appendHeight2Arr = (arr: any[], height = 3) => arr.map((item) => [...item, height])
const handleMapClick = (_viewer, e) => {
  const cartesian = _viewer.camera.pickEllipsoid(e.position, _viewer.scene.globe.ellipsoid)
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  // 开启绘制 Polygon
  if (enablePolygonEdit.value) {
    if (Array.isArray(tempPolyPositions) && tempPolyPositions.length === 0) {
      tempPolyPositions = [
        [longitude, latitude],
        [longitude, latitude]
      ]
      tempPolygonIns = createPolygon(_viewer, tempPolyPositions, {}, true)
    } else {
      tempPolygonIns.polygon.hierarchy = new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArrayHeights([
          116.385847876651, 39.9210402682383, 1000, 116.39341037100495, 39.9121609191357, 1000,
          116.39532922467104, 39.92160280388272, 1000
        ])
      )
      _viewer.scene.requestRender()
      tempPolyPositions.push([longitude, latitude])

      tempPolygonIns.polygon.hierarchy = new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArrayHeights(
          flattenDepth(appendHeight2Arr(tempPolyPositions), 3)
        )
      )
      _viewer.scene.requestRender()
    }
    return
  }
  
  const pick = _viewer.scene.pick(e.position)
  
  if (pick) {
    if (!pick.id || !pick.id.id) return
    // 点击后删除这个实体
    const _selectedLabel = labelMap.get(pick.id.id)
    
    if (!_selectedLabel) return;
    popupContainer.style.display = 'block';
    popupContainer.innerHTML = _selectedLabel.html
    const _positionBase = Cesium.SceneTransforms.worldToWindowCoordinates(
      viewer.scene,
      _selectedLabel.position
    )
    
    if (_positionBase) {
      popupContainer.style.left = _positionBase.x - popupContainer.offsetWidth / 2 + 'px';
      popupContainer.style.top = _positionBase.y - popupContainer.offsetHeight + 'px';
    }
  }

  navigator.clipboard.writeText(`[${longitude}, ${latitude}],`)
  // createText(_viewer, [longitude, latitude], '中国有句古话')
}

const handleMouseMove = (_viewer, e) => {
  // 正在绘制
  if (enablePolygonEdit.value && tempPolygonIns) {
    console.log('tempPolygonIns', tempPolygonIns)
    const _posArr = JSON.parse(JSON.stringify(tempPolyPositions))
    if (Array.isArray(_posArr)) _posArr.pop()
    // const mousePosi = viewer.scene.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid)
    tempPolygonIns.polygon.hierarchy = new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArrayHeights([
        116.385847876651, 39.9210402682383, 1000, 116.39341037100495, 39.9121609191357, 1000,
        116.39532922467104, 39.92160280388272, 1000
      ])
    )
    _viewer.scene.requestRender()
    const cartesian = _viewer.camera.pickEllipsoid(e.endPosition, _viewer.scene.globe.ellipsoid)
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)

    tempPolygonIns.polygon.hierarchy = new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArrayHeights(
        flattenDepth(appendHeight2Arr([...tempPolyPositions, [longitude, latitude]]), 3)
      )
    )
    _viewer.scene.requestRender()
  }
}

const handleMapDoubleClick = (_viewer, e) => {
  const cartesian = _viewer.camera.pickEllipsoid(e.position, _viewer.scene.globe.ellipsoid)
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  console.log(longitude, latitude)
  if (enablePolygonEdit.value) {
    // 双击停止绘制
    tempPolygonIns = null
    enablePolygonEdit.value = false
  }
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
    baseLayerPicker: false // 关闭图层选择器，因为我们只使用天地图
    // terrainProvider: await Cesium.createWorldTerrainAsync(), // 需要外网，暂不支持
  })

  // 去掉底部cesium自带的控制器和logo
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
  // 取消默认的双击事件和单击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  )
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_CLICK
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

  // 添加地名服务
  const wtfsMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 20
  })
  viewer.imageryLayers.addImageryProvider(wtfsMap)

  //   viewer.imageryLayers.add(new Cesium.ImageryLayer(new TdtImageryProvider({
  //     style: 'vec', //style: vec、cva、img、cia、ter
  //     key: token // 需去相关地图厂商申请
  //   })))

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(103.1433262495028, 34.31878650449927, 8850000),
    orientation: {
      heading: Cesium.Math.toRadians(360),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0)
    },
    duration: 0,
    complete: function callback() {
      // 定位完成之后的回调函数
    }
  })

  // 鼠标单击事件
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((e) => handleMapClick(viewer, e), Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler.setInputAction((e) => handleMouseMove(viewer, e), Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  handler.setInputAction(
    (e) => handleMapDoubleClick(viewer, e),
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  )

  getDataList()
}
onMounted(() => {
  initMap()
})
</script>
