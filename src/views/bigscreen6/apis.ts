import request from '@/config/axios'

// 预警信息（大屏右下角）
export const largeScreenGetWarning = async (params) => {
  return await request.get({
    url: '/kaizhou/warning-record/largeScreenGetWarning',
    params
  })
}

// 单条预警（大屏中间位置）
export const largeScreenGetOneWarning = async (params) => {
  return await request.get({
    url: '/kaizhou/warning-record/largeScreenGetOneWarning',
    params
  })
}

// 水质监测（折线图）
export const waterDetection = async () => {
  return await request.get({
    url: '/kaizhou/device-data/waterDetection',
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
export const waterDetectionType = async () => {
  return await request.get({
    url: '/kaizhou/device-data/waterDetectionType',
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
