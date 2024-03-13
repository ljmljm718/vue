import request from '@/config/axios'

// 大屏中间获取一条监测信息
export const largeScreenGetOneDeviceData = async (params) => {
  return await request.get({
    url: '/kaizhou/device-data/largeScreenGetOneDeviceData',
    params
  })
}

// 大屏中间获取一条最新预警信息
export const largeScreenGetOneWarning = async (params) => {
  return await request.get({
    url: '/kaizhou/warning-record/largeScreenGetOneWarning',
    params
  })
}

// 大屏左上角获取农业资源-种植品种
export const getBigLeftTopPin = async () => {
  return await request.get({
    url: '/kaizhou/crop-base/getBigLeftTopPin',
  })
}

// 大屏中上方获取预警记录未处理数量
export const largeScreenGetWarningNum = async () => {
  return await request.get({
    url: '/kaizhou/warning-record/largeScreenGetWarningNum',
  })
}

// 大屏右上角获取环境监测与土壤检测数据
export const largeScreenGetDeviceData = async (params) => {
  return await request.get({
    url: '/kaizhou/device-data/largeScreenGetDeviceData',
    params
  })
}

// 大屏中上方获取预警记录未处理数量
export const largeScreenGetWarning = async (params) => {
  return await request.get({
    url: '/kaizhou/warning-record/largeScreenGetWarning',
    params
  })
}

// 大屏获取左边中间-种植品种分布
export const getBigLeftCentrePlantWu = async () => {
  return await request.get({
    url: '/kaizhou/plant-plan/getBigLeftCentrePlantWu'
  })
}

// 大屏获取左上角农业资源-种植计划
export const getBigLeftTopPlantWu = async () => {
  return await request.get({
    url: '/kaizhou/plant-plan/getBigLeftTopPlantWu',
  })
}

// 大屏中央设备设备数量统计
export const deviceBaseList = async () => {
  return await request.get({
    url: '/kaizhou/device-base/list',
  })
}

// 大屏右下角设备在线统计自定义时间统计
export const selectOfCustom = async (params) => {
  return await request.get({
    url: '/wushan/on-line-monitoring/selectOfCustom',
    params
  })
}

// 大屏右下角设备在线率统计自定义时间统计
export const onlineRateOfCustom = async (params) => {
  return await request.get({
    url: '/wushan/on-line-monitoring/onlineRateOfCustom',
    params
  })
}

// 牛逼的接口 rate
export const onlineRateNormal = async (params) => {
  return await request.get({
    url: '/wushan/on-line-monitoring/onlineRateNormal',
    params
  })
}

// 牛逼的接口 num
export const onlineNumNormal = async (params) => {
  return await request.get({
    url: '/wushan/on-line-monitoring/onlineNumNormal',
    params
  })
}

// 农资类别统计
export const dictDataPage = async (params) => {
  return await request.get({
    url: '/system/dict-data/page',
    params
  })
}

// 采购成本统计
export const productSumPrice = async () => {
  return await request.get({
    url: '/erp/purchase-order/product/sum/price',
  })
}

// 园区、地块、面积统计个数
export const getCountSum = async () => {
  return await request.get({
    url: '/kaizhou/park-base/getCountSum',
  })
}

// 茶叶产量与收入记录并统计，统计按照月份
export const getSumOrderByDate = async () => {
  return await request.get({
    url: '/wushan/farm-record/getSumOrderByDate',
  })
}

// 大屏右下角设备在线统计日统计
export const selectOfDay = async () => {
  return await request.get({
    url: '/wushan/on-line-monitoring/selectOfDay',
  })
}

// 大屏右下角设备在线统计月统计
export const selectOfMonth = async () => {
  return await request.get({
    url: '/wushan/on-line-monitoring/selectOfMonth',
  })
}