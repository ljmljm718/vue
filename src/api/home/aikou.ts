import request from '@/config/axios'

// 设备分类在线离线统计
export const deviceInfoBySum = async () => {
  return await request.get({
    url: '/agriculture/big-screen/deviceInfoBySum',
  })
}

// lkh-预警信息
export const warningRecordInfo = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/warningRecordInfo',
  })
}

// [首页]气象检测/土壤检测(多项参数)
export const aikouMonitor = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/aikouMonitor',
    params
  })
}

// 基地列表
export const parkInfoPage = async (params) => {
  return await request.get({
    url: '/agriculture/park-info/page',
    params
  })
}

// 采收信息统计
export const selectHarvestVolume = async (params) => {
  return await request.get({
    url: '/agriculture/harvest-management/selectHarvestVolume',
    params
  })
}