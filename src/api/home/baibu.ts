import request from '@/config/axios'

//产品介绍
export const baidiHomeDeviceCard = async () => {
  return await request.get({
    url: '/agriculture/big-screen/baidiHomeDeviceCard',
  })
}

// 左上角第二行-获取生长趋势折线图
export const getLineChar = async (data) => {
  return await request.post({
    url: '/agriculture/grow-record/getLineChar',
    data
  })
}

// [左二]lkh-获取 品种种植面积及占比率
export const getCropBaseCountRatio = async () => {
  return await request.get({
    url: '/agriculture/crop-base/getCropBaseCountRatio'
  })
}

// 【左四】数据采集趋势
export const QueryCurrentDateCount = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/QueryCurrentDateCount',
    params
  })
}

// 【左四】数据采集趋势
export const QueryMonitorTypeCountRanking = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/QueryMonitorTypeCountRanking',
    params
  })
}

// 【右二】种植基地、地块、品种统计
export const getBaseCollect = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getBaseCollect'
  })
}

// 【第三行，右侧】产品流通统计
export const locationPrice = async () => {
  return await request.get({
    url: '/agriculture/sales-management/location/price'
  })
}
