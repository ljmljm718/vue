import request from '@/config/axios'

// 在线 离线
export const qjDeviceStatistics = async () => {
  return await request.get({
    url: '/agriculture/big-screen/qjDeviceStatistics'
  })
}
// 左侧树状图
export const ParkTree = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getParkTree'
  })
}
// 中间内容
export const EquipmentPhotographAndVideo = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentPhotographAndVideo',
    params
  })
}
