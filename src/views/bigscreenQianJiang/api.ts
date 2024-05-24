import request from '@/config/axios'

// 基地地块选择框
export const getParkBaseInfo = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getParkBaseInfo',
    params
  })
}

// 左一：气象监测
export const qianjiangMonitor = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/qianjiangMonitor',
    params
  })
}


// 中间卡片：设备数据统计
export const qjDeviceStatistics = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/qjDeviceStatistics',
    params
  })
}

// 右一：农业资源
export const getQianjiangAgriResource = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getQianjiangAgriResource',
    params
  })
}

// 右三：预警信息
export const qianjiangWarnRecordInfo = async (params) => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/qianjiangWarnRecordInfo',
    params
  })
}

// 右二：设备信息
export const qjDeviceInfo = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/qjDeviceInfo',
    params
  })
}