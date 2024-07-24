<template>
  <div id="tangbaMap" class="min-w-[100px] min-h-[100px]"> </div>
</template>
<script setup lang="ts">
import { log } from 'console'
import { debounce } from 'lodash-es'
// @ts-ignore
window._AMapSecurityConfig = { securityJsCode: '289153494763707d55b03878ace1cb08' }

defineOptions({ name: 'MapTangBa' })

// 初始化地图，点击地图自动选取坐标点
let map: any = null
let info: any = null
// let satelliteLayer = new AMap.TileLayer.Satellite()
const initMap = () => {
  // @ts-ignore
  // map = new T.Map('tangbaMap', [
  //   {
  //     projection: 'EPSG:900913',
  //     minZoom: 5,
  //     maxZoom: 18
  //   }
  // ])

  //修改默认地图为卫星图+有注记
  //影像地图图层
  const imageURL =
    'http://t0.tianditu.gov.cn/img_w/wmts?' +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles' +
    '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}' +
    '&tk=	3499364c33fd4aa4415dd8765d4c5b77'
  //影响注记图层
  const imageURLT =
    'http://t0.tianditu.gov.cn/cia_w/wmts?' +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles' +
    '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}' +
    '&tk=	3499364c33fd4aa4415dd8765d4c5b77'
  const lay = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 })
  const lay2 = new T.TileLayer(imageURLT, { minZoom: 1, maxZoom: 18 })
  const config = { layers: [lay, lay2] }
  map = new T.Map('tangbaMap', config)

  //@ts-ignore
  const lnglat = new T.LngLat(109.24604650765662, 31.41416444104432)
  map.centerAndZoom(lnglat, 13)
  // //地图类型切换
  // const ctrl = new T.Control.MapType()
  // map.addControl(ctrl)

  // map.add(satelliteLayer)
  //获取点击处坐标
  map.addEventListener('click', (e) => {
    const { lnglat } = e
    const { lng, lat } = lnglat

    //复制到剪贴板
    navigator.clipboard.writeText(`[${lng}, ${lat}],`)
  })

  //   map.on('dragstart', () => {
  //     map.clearInfoWindow()
  //   })
  // }

  //开始拖拽后清除信息窗口
  map.addEventListener('dragstart', (e) => {
    map.closeInfoWindow()
  })
}
// const addSatellite = () => {
//   map.add(satelliteLayer)
// }
// const removeSatellite = () => {
//   map.remove(satelliteLayer)
// }
//设置地图投影类型
const addSatellite = () => {
  map.setMapType(map.TMAP_HYBRID_MAP)
}
const removeSatellite = () => {
  map.setMapType(map.TMAP_TERRAIN_MAP)
}
const addMarkerToMap = (longitude, latitude, title = '', icon = '/tangba/offlineMonitor.png') => {
  if (!longitude || !latitude) return

  // @ts-ignore
  const marker = new T.Marker(
    new T.LngLat(longitude, latitude),
    // title,
    // @ts-ignore
    {
      icon: new T.Icon({
        // image: icon,
        iconUrl: icon,
        // @ts-ignore
        iconSize: new T.Point(30, 32)
        // @ts-ignore
        // imageOffset: new AMap.Pixel(-9, -3), //图像相对展示区域的偏移量，适于雪碧图等
        // iconAnchor:Point(12, 41)//图标的定位锚点。此点用来决定图标与地理位置的关系，是相对于图标左上角的偏移值，默认等于图标宽度和高度的中间值。
        // @ts-ignore
        // imageSize: new AMap.Size(30, 32) //根据所设置的大小拉伸或压缩图片
      })
    }
  )
  if (map) {
    map.addOverLay(marker)
    // fitMarkerOnMap()
  }
  return marker
}

const fitMarkerOnMap = debounce(
  () => {
    map.setFitView()
  },
  250,
  { maxWait: 2000 }
)

// const setMapCenter = (longitude, latitude) => {
//   if (!longitude || !latitude) return
//   if (map) map.setCenter([longitude, latitude])
// }
//设置地图中心
const setMapCenter = (longitude, latitude) => {
  if (!longitude || !latitude) return
  if (map) map.panTo(new T.LngLat(longitude, latitude))
}

const setMapZoom = (zoom: number = 13) => {
  if (map) map.setZoom(zoom)
}

const openInfoWindow = (info: string, location: Array<any>) => {
  if (Array.isArray(location)) {
    const [val1, val2] = location
    if (!val1 || !val2) return
  }
  if (!info || !location) return

  // @ts-ignore
  const infoWindow = new T.InfoWindow({
    // isCustom: true,
    content: info
  })
  // infoWindow.setContent(info)
  // infoWindow.open(map, location)
  map.openInfoWindow(infoWindow, location)
  console.log('infowindow', infoWindow)
}

defineExpose({
  addMarkerToMap,
  setMapCenter,
  setMapZoom,
  openInfoWindow,
  addSatellite,
  removeSatellite
})

onMounted(() => {
  initMap()
})
</script>
<style scoped lang="scss">
//左下角版权
// .tdt-control-copyright.tdt-control {
//   display: none;
// }
.online-bug,
.offline-bug,
.online-monitor,
.offline-monitor,
.online-soil,
.offline-soil,
.online-weather,
.offline-weather,
.online-grow,
.offline-grow {
  background-size: 100% auto;
}
.online-bug {
  background-image: url(./assets/tangba/onlineBug.png);
}
.offline-bug {
  background-image: url(./assets/tangba/offlineBug.png);
}

.online-monitor {
  background-image: url(./assets/tangba/onlineMonitor.png);
}
.offline-monitor {
  background-image: url(./assets/tangba/offlineMonitor.png);
}

.online-soil {
  background-image: url(./assets/tangba/onlineSoil.png);
}
.offline-soil {
  background-image: url(./assets/tangba/offlineSoil.png);
}

.online-weather {
  background-image: url(./assets/tangba/onlineWeather.png);
}
.offline-weather {
  background-image: url(./assets/tangba/offlineWeather.png);
}

.online-grow {
  background-image: url(./assets/tangba/onlineGrow.png);
}
.offline-grow {
  background-image: url(./assets/tangba/offlineGrow.png);
}
</style>