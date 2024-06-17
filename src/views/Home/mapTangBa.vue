<template>
  <div id="tangbaMap" class="min-w-[100px] min-h-[100px]"></div>
</template>
<script setup lang="ts">
// @ts-ignore
window._AMapSecurityConfig = { securityJsCode:'289153494763707d55b03878ace1cb08' }

defineOptions({ name: 'MapTangBa' })

// 初始化地图，点击地图自动选取坐标点
let mapIns:any = null
const initMap = (center:Array<number> = [109.24604650765662, 31.41416444104432]) => {
  // @ts-ignore
  mapIns = new AMap.Map("tangbaMap", {
    zoom: 13, center,
    // mapStyle: 'amap://styles/blue', //设置地图的显示样式
  })
  mapIns && mapIns.on('click', (e) => {
    navigator.clipboard.writeText(`[${e.lnglat.R.toString()}, ${e.lnglat.Q.toString()}],`)
  })

  mapIns.on('dragstart', () => {
    mapIns.clearInfoWindow();
  })
}

const addMarkerToMap = (longitude, latitude, title = '', icon = '/tangba/offlineMonitor.png') => {
  if (!longitude || !latitude) return
  // @ts-ignore
  const marker = new AMap.Marker({
    // @ts-ignore
    position: new AMap.LngLat(longitude, latitude),
    title,
    // @ts-ignore
    icon: new AMap.Icon({
      image: icon,
      // @ts-ignore
      size: new AMap.Size(30, 32),
      // @ts-ignore
      // imageOffset: new AMap.Pixel(-9, -3), //图像相对展示区域的偏移量，适于雪碧图等
      // @ts-ignore
      imageSize: new AMap.Size(30, 32), //根据所设置的大小拉伸或压缩图片
    })
  });
  if (mapIns) mapIns.add(marker);
  return marker
}

const setMapCenter = (longitude, latitude) => {
  if (!longitude || !latitude) return
  if (mapIns) mapIns.setCenter([longitude, latitude])
}

const setMapZoom = (zoom: number = 13) => {
  if (mapIns) mapIns.setZoom(zoom)
}

const openInfoWindow = (info:string, location:Array<any>) => {
  if (!info || !location) return
  // @ts-ignore
  const infoWindow = new AMap.InfoWindow({
    isCustom: true,
    content: info
  })
  infoWindow.open(mapIns, location)
}

defineExpose({
  addMarkerToMap,
  setMapCenter,
  setMapZoom,
  openInfoWindow
})

onMounted(() => { initMap() })
</script>