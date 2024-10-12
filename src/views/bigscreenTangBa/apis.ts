import request from '@/config/axios'

// 基地地块选择框
export const getParkBaseInfo = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getParkBaseInfo',
    params
  })
}

// 中间-设备信息
export const getEquipmentMap = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentMap',
    params
  })
}

// 中间上 塘坝 设备监测列表
export const getDeviceCategoryTree = (params) => {
  return request.get({ url: `/agriculture/big-screen/getDeviceCategoryTree`, params})
}

// 中间上 设备属性详情-根据设备id查询
export const getDeviceInfo = (params) => {
  return request.get({ url: `/agriculture/device-info/get`, params})
}


// 左一：气象监测
export const qianjiangMonitor = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/qianjiangMonitor',
    params
  })
}

// 左三-园区监控
export const getEquipmentPhotographAndVideo = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentPhotographAndVideo',
    params
  })
}

// 中间上方卡片
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

// 右二-设备信息
export const qjDeviceInfo = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/qjDeviceInfo',
    params
  })
}

// 中间下方：枳壳树长势分析
export const getLineChar = async (data) => {
  return await request.post({
    url: '/agriculture/grow-record/getLineChar',
    data
  })
}
