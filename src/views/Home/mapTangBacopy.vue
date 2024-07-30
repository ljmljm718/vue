<template>
  <div id="tangbaMap" class="min-w-[100px] min-h-[100px]"> </div>
</template>
<script setup lang="ts">
import { log } from 'console'
import { debounce } from 'lodash-es'

defineOptions({ name: 'MapTangBa' })

// 初始化地图，点击地图自动选取坐标点
let map: any = null
let info: any = null
// let satelliteLayer = new AMap.TileLayer.Satellite()

interface LatLon {
  lat: number
  lon: number
}
//封装转换坐标函数高德转天地图
const createGcjToWgsConverter = () => {
  const PI = 3.1415926536
  const a = 6378245.0
  const ee = 0.0066934216

  const transformLat = (x: number, y: number): number => {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0
    ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0
    ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0
    return ret
  }

  const transformLon = (x: number, y: number): number => {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0
    ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0
    ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0
    return ret
  }

  const delta = (lat: number, lon: number): LatLon => {
    let dLat = transformLat(lon - 105.0, lat - 35.0)
    let dLon = transformLon(lon - 105.0, lat - 35.0)
    let radLat = (lat / 180.0) * PI
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    let sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI)
    dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI)
    return { lat: dLat, lon: dLon }
  }

  const transformGCJ2WGS = (gcjLon: number, gcjLat: number): LatLon => {
    let d = delta(gcjLat, gcjLon)
    return { lat: gcjLat - d.lat, lon: gcjLon - d.lon }
  }

  const gcj_wgs_encrypts = (latlons: { lat: number; lng: number }[]): LatLon[] => {
    return latlons.map((latlon) => transformGCJ2WGS(latlon.lng, latlon.lat))
  }

  return { transformGCJ2WGS, gcj_wgs_encrypts }
}

// 创建转换器实例
const { transformGCJ2WGS } = createGcjToWgsConverter()

const initMap = () => {
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
  
  const mapTypeSelect = [{
    'title': '地图', //地图控件上所要显示的图层名称
    'icon': 'http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png', //地图控件上所要显示的图层图标（默认图标大小80x80）
    'layer': window.TMAP_NORMAL_MAP //地图类型对象，即MapType。
  },
    {
      'title': '卫星',
      'icon': ' http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellite.png',
      'layer': window.TMAP_SATELLITE_MAP
    }, {
      'title': '卫星混合',
      'http': 'api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png',
      'layer': 'TMAP_HYBRID_MAP'
    }, {
      'title': '地形',
      'icon': ' http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrain.png',
      'layer': window.TMAP_TERRAIN_MAP
    },
    {
      'title': '地形混合',
      'icon': ' http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrainpoi.png',
      'layer': window.TMAP_TERRAIN_HYBRID_MAP
    }
  ];
  const ctrl = new T.Control.MapType({ mapTypes: mapTypeSelect }); // 初始化地图类型选择控件
  map.addControl(ctrl); //添加地图选择控件
  

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

const markerList:Map<string, any> = new Map()
const addMarkerToMap = (longitude: number, latitude:number, title = '', icon = '/tangba/offlineMonitor.png') => {
  if (!longitude || !latitude) return
  const { lon, lat} = transformGCJ2WGS(longitude, latitude)

  
  // @ts-ignore
  const marker = new T.Marker(
    new T.LngLat(lon, lat),
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
  markerList.set(longitude + '_' + latitude, marker)

  marker.on('click', (e) => {
    const { lnglat } = e;
    const { lat, lng } = lnglat
    map.centerAndZoom(new T.LngLat(lng, lat), 16)
  })
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
  //调用转换坐标
  const { lon, lat } = transformGCJ2WGS(longitude, latitude)
  
  if (map) map.panTo(new T.LngLat(lon, lat))
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
  const _marker = markerList.get(location[0] + '_' + location[1])
  
  // @ts-ignore
  const infoWindow = new T.InfoWindow()
  infoWindow.setContent(info)
  if (_marker) _marker.openInfoWindow(infoWindow)
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