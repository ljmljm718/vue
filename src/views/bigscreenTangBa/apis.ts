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


// 左一：气象监测
export const qianjiangMonitor = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/qianjiangMonitor',
    params
  })
}