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
export const getLineChar = async (params) => {
  return await request.get({
    url: '/agriculture/grow-record/getLineChar',
    params
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

