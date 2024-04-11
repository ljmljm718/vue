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
export const monitorDeviceByParkId = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/monitorDeviceByParkId',
    params
  })
}

// 右三-监控设备
export const warningRecordInfo = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/warningRecordInfo'
  })
}