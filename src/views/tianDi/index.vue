<template>
  <div class="relative">
    <div id="mapDiv" class="w-[100vw] h-[100vh] z-0">TD</div>
    <div class="absolute z-36 left-[1rem] bottom-[1rem] bg-white p-2">
      <el-button class="my-button" @click="markerTool.open()">标注开启</el-button>
      <el-button class="my-button" @click="editMarker()">编辑标注</el-button>
      <el-button class="my-button" @click="endeditMarker()">关闭标注编辑</el-button>
      <el-button class="my-button" @click="drawPolygon()">绘制地块</el-button>
      <el-button class="my-button" @click="saveCoordinates()">保存地块坐标</el-button>
      <el-button class="my-button" @click="deleteCoordinates()">删除地块</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
let map: any = null
let markerTool: any = null
let savedCoordinates: Array<any> = [] //保存地块坐标数组
let editMarker: any

// 删除已经绘制的地块
const deleteCoordinates = () => {
  savedCoordinates = []
  map.clearOverLays()
}

const endeditMarker = () => {
  let markers = markerTool.getMarkers()
  for (let i = 0; i < markers.length; i++) {
    markers[i].disableDragging()
  }
}

//绘制地块功能
const drawPolygon = () => {
  let PolygonTool = new T.PolygonTool(map)
  //清除地图上已有的覆盖物
  // map.clearOverLays()
  PolygonTool.open()

  PolygonTool.addEventListener('draw', (e: any) => {
    console.log(e)
    //获取地块的坐标点数组
    const coordinates = e.currentLnglats
    //保存坐标点到数组中
    if (coordinates.length > 0) {
      savedCoordinates.push(coordinates)
    }
    PolygonTool.close()
    // console.log('ttttt', savedCoordinates)
  })
}
const saveCoordinates = () => {
  console.log(savedCoordinates)
  if (Array.isArray(savedCoordinates) && savedCoordinates.length === 0) return
  // 将坐标点保存到本地存储
  localStorage.setItem('polygonCoordinates', JSON.stringify(savedCoordinates))
}
//删除上一个绘制的地块
const removeLastPolygon = () => {
  if (savedCoordinates.length > 0) {
    savedCoordinates.pop() // 从坐标数组中移除最后一个地块
  }
  //在地图上删除上一个地块？
}

// 初始化
const initMap = () => {
  // @ts-ignore
  map = new T.Map('mapDiv', [
    {
      projection: 'EPSG:900913',
      minZoom: 5,
      maxZoom: 18
    }
  ])

  //创建对象
  const ctrl = new T.Control.MapType()
  //添加控件
  map.addControl(ctrl)

  // 配置地图控制
  const configureMap = (map: any) => {
    map.enableScrollWheelZoom()
    map.enableDrag()
    map.disableDoubleClickZoom()
    map.disableKeyboard()
  }
  configureMap(map)

  //获取点击处坐标
  map.addEventListener('click', (e) => {
    const { lnglat } = e
    const { lng, lat } = lnglat

    //复制到剪贴板
    navigator.clipboard.writeText(`[${lng}, ${lat}],`)
  })

  //@ts-ignore
  const lnglat = new T.LngLat(116.40969, 39.89945)
  map.centerAndZoom(lnglat, 12)

  return
  //多边形
  const polyPoints = [
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
    [116.38555726696232, 39.92133226820324]
  ]

  const pgpoints: T.LngLat[] = []

  polyPoints.forEach((item) => {
    const [long, lat] = item
    pgpoints.push(new T.LngLat(long, lat))
  })

  const polygon = new T.Polygon(pgpoints, {
    color: 'blue',
    weight: 3,
    opacity: 0.5,
    fillColor: '#FFFFFF',
    fillOpacity: 0.5
  })
  map.addOverLay(polygon)

  //信息窗口
  const point = new T.LngLat(116.400244, 39.92556)
  const marker = new T.Marker(point) // 创建标注
  map.addOverLay(marker)
  const markerInfoWin = new T.InfoWindow('信息窗口')
  marker.addEventListener('click', () => {
    marker.openInfoWindow(markerInfoWin)
  }) // 将标注添加到地图中

  //标注工具
  markerTool = new T.MarkTool(map, { follow: true })
  editMarker = () => {
    let markers = markerTool.getMarkers()
    for (let i = 0; i < markers.length; i++) {
      markers[i].enableDragging()
    }
  }
}

onMounted(() => {
  initMap()
})
</script>
