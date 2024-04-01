import request from '@/config/axios'

// 预警信息（大屏右下角）
export const largeScreenGetWarning = async (params) => {
  return await request.get({
    url: '/agriculture/agri-warning-record/list',
    params
  })
}

// 单条预警（大屏中间位置） parkId parkName
export const largeScreenGetOneWarning = async (params) => {
  return await request.get({
   // url: '/kaizhou/warning-record/largeScreenGetOneWarning',
    params
  })
}

// 水质监测（折线图）
export const waterDetection = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/waterQualityDataLineChart',
    params
  })
}

// 大屏中央设备设备数量统计  /agriculture/big-screen/getDeviceState
export const selectStateNum = async () => {
  return await request.get({
    url: '/agriculture/big-screen/deviceInfoByPark',
  })
}

// 大屏中央设备设备数量统计
export const deviceBaseList = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getDeviceState',
  })
}

// 水质监测（八项参数）
export const waterDetectionType = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/waterQualityData',
    params
  })
}

// 大屏气象站监测下拉列表 deviceName =气象站
export const deviceBasePage = async () => {
  return await request.get({
    url: '/agriculture/device-info/page',
    params: {
      deviceType: '25,29'
    }
  })
}

// 左下角监控设备(两条)
export const monitoringEquipment = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/page',
    params
  })
}

// 大屏中央右边监控设备(单条
export const viewMonitoring = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/page',
    params
  })
}

// 大屏左上角根据 设备 获取 环境监测数值
export const getDeviceDataYouEnvironment = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/environmentalData',
    params
  })
}

// 大屏中央传感器设备显示(单条)
export const waterDetectionByAddress = async (params) => {
  return await request.get({
    //url: '/kaizhou/device-data/waterDetectionByAddress',
    params
  })
}

// 大屏左侧环境监测折线图
export const getDeviceDataYouEnvironmentLine = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/environmentalDataLineChart',
    params
  })
}
//基地
export const page = async (params) => {
  return await request.get({
    url: '/agriculture/park-info/page',
    params
  })
}
//水塘
export const park = async (params) => {
  return await request.get({
    url: '/agriculture/park-info/park-detail/list-by-park-id',
    params
  })
}

//单个摄像头
export const page2 = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/page',
    params
  })
}
//单个数据采集
export const page3 = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/page',
    params
  })
}
//预警信息
export const list = async (params) => {
  return await request.get({
    url: '/agriculture/agri-warning-record/list',
    params
  })
}