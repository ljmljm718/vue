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

// 大屏根据地块获取巡检统计
export const getCountPageByBaseId = async (params) => {
  return await request.get({
    url: '/agriculture/check-logs/getCountPageByBaseId',
    params
  })
}

// 根据基地获取监控设备列表
export const getPageMonitoring = async (data) => {
  return await request.post({
    url: '/agriculture/device-info/getPageMonitoring',
    data,
    headersType: 'multipart/form-data; boundary=--------------------------999028645642470077276192',
  })
}