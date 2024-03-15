import request from '@/config/axios'
//农业资源
export const deviceTotal = async () => {
  return await request.get({
    url: '/shizhu/big-screen/deviceTotal',
  })
}
//左上环境-土壤-视频
export const deviceTypeStatistics = async (params:any) => {
  return await request.get({
    url: '/shizhu/big-screen/deviceTypeStatistics',
    params
  })
}
//左侧饼状图
export const deviceStateStatistics = async () => {
  return await request.get({
    url: '/shizhu/big-screen/deviceStateStatistics',
  })
}
//实时监控 气象监测与土壤检测
export const AvgDataValueByHour = async (params:any) => {
  return await request.get({
    url: '/shizhu/big-screen/getAvgDataValueByHour',
    params
  })
}
//预警信息
export const MonitorWarnRecord = async () => {
  return await request.get({
    url: '/kaizhou/warning-record/getMonitorWarnRecord',
  })
}
//中间地图标点
export const DeviceAndWarn = async () => {
  return await request.get({
    url: '/kaizhou/big-screen/getDeviceAndWarn',
  })
}