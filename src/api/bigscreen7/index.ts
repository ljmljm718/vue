import request from '@/config/axios'
//环境数据顶部信息
export const environmentData = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/environmentData',
    params
  })
}
//环境数据echart
export const environmentView = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/environmentView',
    params
  })
}
//预警信息
export const warningRecordInfo = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/warningRecordInfo',
  })
}
//获取基地和棚区
export const ParkBaseInfo = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getParkBaseInfo',
    params
  })
}

//获取基地和棚区
export const monitorDeviceByPark = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/monitorDeviceByPark',
    params
  })
}
//设备运行统计
export const deviceHistoryStatus = async () => {
  return await request.get({
    url: '/agriculture/big-screen/deviceHistoryStatus',
  })
}
//设备运行统计
export const deviceInfoCard = async () => {
  return await request.get({
    url: '/agriculture/big-screen/deviceInfoCard',
  })
}