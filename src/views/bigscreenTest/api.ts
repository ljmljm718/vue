import request from '@/config/axios'

/** 基地导览大屏 */
// 左一-基地树
export const getParkTree = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getParkTree'
  })
}

// 左二-监控设备
export const getEquipmentPhotographAndVideo = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentPhotographAndVideo',
    params
  })
}

// 左三-监控通知事件
export const monitoringEquNoticePage = async (params) => {
  return await request.get({
    url: '/agriculture/monitoring-equipment-notice/page',
    params
  })
}

/** 智慧种植大屏 */
// [左一-基础设施]池塘数量,鱼苗总数
export const getPondCountFrySum = async () => {
  return await request.get({
    url: '/agri/duck-house-management/getPondCountFrySum'
  })
}

// 左上角第二行-获取生长趋势折线图
export const getLineChar = async (data) => {
  return await request.post({
    url: '/agriculture/grow-record/getLineChar',
    data
  })
}

// 左三-产量分析
export const selectHarvest = async () => {
  return await request.get({
    url: '/agriculture/harvest-management/selectHarvest'
  })
}

// 【中间上】--设备状态及数量
export const getEquipmentCountSum = async () => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentCountSum'
  })
}

// 【右上-物联网设备】
export const getEquipmentCountSumOrderByType = async () => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentCountSumOrderByType'
  })
}

// 中间下-特色产品
export const villageProductPage = async () => {
  return await request.get({
    url: '/digital/village-product/page'
  })
}

// 【右下实时数据】气象
export const environmentalDataHomePageA = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/environmentalDataHomePageA',
    params
  })
}

// 【右下实时数据】土壤
export const environmentalDataHomePageC = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/environmentalDataHomePageC',
    params
  })
}

// 【右下实时数据】虫情
export const environmentalDataHomePageB = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/environmentalDataHomePageB',
    params
  })
}

// 【右下实时数据】水质
export const waterQualityData = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/waterQualityData',
    params
  })
}

/** 风险预警 */
// 上一-预警信息列表接口
export const fulingWarningInfo = async (params) => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/fulingWarningInfo',
    params
  })
}

export const fulingWarningDistr = async (params) => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/fulingWarningDistr',
    params
  })
}

// 虫害数量
export const getPestLevelChart = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/getPestLevelChart',
    params
  })
}

// 上二-报警数量统计
export const warningNum = async (params) => {
  return await request.get({
    url: '/agriculture/agri-warning-record/warningNum',
    params
  })
}

// 上三-未处理的预警信息列表
export const agriWarningRecordPage = async (params) => {
  return await request.get({
    url: '/agriculture/agri-warning-record/page',
    params
  })
}
