import request from '@/config/axios'
//产品介绍
export const Statistics = async () => {
  return await request.get({
    url: '/agriculture/big-screen/baidiQuantityStatistics',
  })
}
//左上第二部分
export const  baidiParkInfo= async () => {
  return await request.get({
    url: '/agriculture/big-screen/baidiParkInfo',
  })
}
//左上第三部分
export const  page= async (params) => {
  return await request.get({
    url: '/agriculture/crop-base/page?',
    params
  })
}
//预警信息
export const  warningRecordInfo= async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/warningRecordInfo',
  })
}
//中下右文旅销售额
export const  SmartTour= async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/bigScreenSmartTour',
  })
}
//中下右旅客流量
export const  People= async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/bigScreenSmartTourPeople',
  })
}
//中下右旅客流量
export const  deviceCount= async () => {
  return await request.get({
    url: '/baidi/big-screen/deviceCount',
  })
}
//左二
export const  getLineChar= async (params) => {
  return await request.post({
    url: '/agriculture/grow-record/getLineChar',
    params
  })
}
//特色产品土鸡
export const  featureProduct= async () => {
  return await request.get({
    url: '/baidi/big-screen/featureProduct',
  })
}
//设备 接口
export const  sensorDevice= async () => {
  return await request.get({
    url: '/baidi/big-screen/sensorDevice',
  })
}
//获取实时数据
export const  realTimeDataByDeviceId= async (params) => {
  return await request.get({
    url: '/baidi/big-screen/realTimeDataByDeviceId',
    params
  })
}
//设备数量统计
export const  deviceStatistics=async () => {
  return await request.get({
    url: '/baidi/big-screen/deviceStatistics',
    
  })
}
//地图中间标点
export const  DevicePoint=async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/bigScreenDevicePointBaidi',
    
  })
}