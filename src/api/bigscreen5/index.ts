import request from '@/config/axios'
//农业资源
export const AgriResources = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getAgriResources',
  })
}
//种植分布
export const getCropInfo = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getCropInfo',
  })
}
//种植基地
export const BaseCollect = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getBaseCollect',
  })
}
//设备资源
export const homeDeviceCard = async () => {
  return await request.get({
    url: '/agriculture/big-screen/homeDeviceCard',
  })
}
//气象监测
export const  MeteorologyDevice= async () => {
  return await request.get({
    url: '/agriculture/big-screen/getMeteorologyDevice',
  })
}
//气象监测数据
export const  MeteorologyDeviceData= async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getMeteorologyDeviceData',
    params
  })
}
//获取棚内环境监测基地和棚区
export const ParkBaseInfo = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getParkBaseInfo',
    params
  })
}
//获取棚内环境监测数据
export const pageShedMonitoringData = async (params) => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/pageShedMonitoringData',
    params
  })
}
//地图中间数据
export const bigScreenDevicePoint = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/bigScreenDevicePoint',
  })
}