import request from '@/config/axios'

// 预警信息（大屏右下角）
export const largeScreenGetWarning = async (params) => {
  return await request.get({
    url: '/kaizhou/warning-record/largeScreenGetWarning',
    params
  })
}

// 单条预警（大屏中间位置） parkId parkName
export const largeScreenGetOneWarning = async (params) => {
  return await request.get({
    url: '/kaizhou/warning-record/largeScreenGetOneWarning',
    params
  })
}

// 水质监测（折线图）
export const waterDetection = async (params) => {
  return await request.get({
    url: '/kaizhou/device-data/waterDetection',
    params
  })
}

// 大屏中央设备设备数量统计
export const selectStateNum = async () => {
  return await request.get({
    url: '/kaizhou/device-base/selectStateNum',
  })
}

// 大屏中央设备设备数量统计
export const deviceBaseList = async () => {
  return await request.get({
    url: '/kaizhou/device-base/list',
  })
}

// 水质监测（八项参数）
export const waterDetectionType = async (params) => {
  return await request.get({
    url: '/kaizhou/device-data/waterDetectionType',
    params
  })
}

// 大屏气象站监测下拉列表 deviceName =气象站
export const deviceBasePage = async () => {
  return await request.get({
    url: '/kaizhou/device-base/page',
    params: {
      deviceName: '气象站'
    }
  })
}

// 左下角监控设备(两条)
export const monitoringEquipment = async () => {
  return await request.get({
    url: '/yyang/monitoring-equipment/monitoringEquipment'
  })
}

// 大屏中央右边监控设备(单条
export const viewMonitoring = async (params) => {
  return await request.get({
    url: '/yyang/monitoring-equipment/viewMonitoring',
    params
  })
}

// 大屏左上角根据 设备 获取 环境监测数值
export const getDeviceDataYouEnvironment = async (params) => {
  return await request.get({
    url: '/kaizhou/device-data/getDeviceDataYouEnvironment',
    params
  })
}

// 大屏中央传感器设备显示(单条)
export const waterDetectionByAddress = async (params) => {
  return await request.get({
    url: '/kaizhou/device-data/waterDetectionByAddress',
    params
  })
}

// 大屏左侧环境监测折线图
export const getDeviceDataYouEnvironmentLine = async (params) => {
  return await request.get({
    url: '/kaizhou/device-data/getDeviceDataYouEnvironmentLine',
    params
  })
}
