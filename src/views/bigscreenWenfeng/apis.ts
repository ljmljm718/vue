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
