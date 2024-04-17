import request from '@/config/axios'

// 首行卡片-数据采集量
export const homeDataCollection = async () => {
  return await request.get({
    url: '/agriculture/big-screen/homeDataCollection',
  })
}

// 首页首行卡片-设备预警数
export const deviceWarnAmount = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/deviceWarnAmount',
  })
}

// 数据采集-柱状图
export const QueryCurrentDateCount = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/QueryCurrentDateCount',
    params
  })
}

// 数据采集-类型排行
export const QueryMonitorTypeCountRanking = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/QueryMonitorTypeCountRanking',
    params
  })
}

// 首行卡片-订单完成率
export const orderFinishRate = async () => {
  return await request.get({
    url: '/baidi/big-screen/orderFinishRate'
  })
}

// 设备类型占比
export const deviceTypeCount = async () => {
  return await request.get({
    url: '/baidi/big-screen/deviceTypeCount'
  })
}

// 产品制造及库存
export const getProductionAndStock = async () => {
  return await request.get({
    url: '/baidi/big-screen/getProductionAndStock'
  })
}

// 预警量趋势
export const warnAmountTrend = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/warnAmountTrend'
  })
}

// 设备巡检概览
export const deviceCheckInfo = async () => {
  return await request.get({
    url: '/baidi/big-screen/deviceCheckInfo'
  })
}

// 首页基地预警处理比率
export const parkWarnDealRate = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/parkWarnDealRate'
  })
}

// 产品销量
export const productionSale = async () => {
  return await request.get({
    url: '/baidi/big-screen/productionSale'
  })
}

// 产品销量排行
export const productionSaleRank = async (params) => {
  return await request.get({
    url: '/baidi/big-screen/productionSaleRank',
    params
  })
}
