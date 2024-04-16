import request from '@/config/axios'

// 左一-产业介绍-产业统计
export const industryStatistics = async () => {
  return await request.get({
    url: '/agriculture/big-screen/industryStatistics'
  })
}

// 左一-产业介绍-基地信息
export const baidiParkInfo = async () => {
  return await request.get({
    url: '/agriculture/big-screen/baidiParkInfo'
  })
}

// 右三-监控设备
export const monitorDeviceByParkId = async (data) => {
  return await request.post({
    url: '/agriculture/device-info/getPageMonitoring',
    data,
    headersType: 'multipart/form-data; boundary=--------------------------999028645642470077276192',
  })
}

// 右三-监控设备
export const warningRecordInfo = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/warningRecordInfo'
  })
}

// 左二-长势分析
export const getLineChar = async (data) => {
  return await request.post({
    url: '/agriculture/grow-record/getLineChar',
    data
  })
}

// 右二-上部分-环境监测
export const baibuTypeMonitor = async (data) => {
  return await request.post({
    url: '/yyang/equipment-data/baibuTypeMonitor',
    data
  })
}

// 地块查询
export const parkDetailPage = async () => {
  return await request.get({
    url: '/agriculture/park-detail/page'
  })
}

// 右二-1号设备，设备查询
export const getDeviceForPark = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getDeviceForPark',
    params
  })
}

// 右二-1号设备，设备查询
export const featureProduct = async () => {
  return await request.get({
    url: '/baidi/big-screen/featureProduct',
  })
}

// 右二-1号设备，设备查询
export const deviceStatistics = async () => {
  return await request.get({
    url: '/baidi/big-screen/deviceStatistics',
  })
}

// 右二-1号设备，设备查询
export const deviceByCategoryName = async (params) => {
  return await request.get({
    url: '/baidi/big-screen/deviceByCategoryName',
    params
  })
}

// 左三-产线设备-该产线设备信息
export const deviceInfoById = async (params) => {
  return await request.get({
    url: '/baidi/big-screen/deviceInfoById',
    params
  })
}

// [大屏]气象站/土壤传感/虫情测报灯相关读数
export const getDeviceStateByParams = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/baibuEquipmentMonitor',
    params
  })
}

// 中间-设备点位
export const bigScreenDevicePointBaidi = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/bigScreenDevicePointBaidi'
  })
}

export const arrayFormatter = (array = [], subGroupLength = 2) => {
  let index = 0;
  const newArray:any = [];
  while(index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}
