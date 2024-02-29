import request from '@/config/axios'

//中间-设备数量统计
export const deviceStatistics = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/deviceStatistics',
  })
}
//物联设备数据 选择园区
export const ParkBaseInfo = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getParkBaseInfo',
  })
}
//物联设备数据 选择地块
export const getParkBaseInfo = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getParkBaseInfo',
  })
}
//物联设备数据 设备信息
export const IoTLatestData = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getIoTLatestData',
  })
}
//产品介绍
export const cropBase = async (params:any) => {
  return await request.get({
    url: 'kaizhou/big-screen/cropBase',
    params
  })
}
//种植资源左侧
export const PlantInfo = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getPlantInfo',
    
  })
}
//种植资源右侧
export const PlantArea = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getPlantArea',
    
  })
}
//地图-设备与预警信息
export const DeviceAndWarn = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getDeviceAndWarn',
    
  })
}
