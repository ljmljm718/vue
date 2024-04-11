import request from '@/config/axios'

// [大屏]基地数量和种植面积(亩)
export const getParkCountAndAreaSum = async () => {
  return await request.get({
    url: '/agriculture/device-info/getParkCountAndAreaSum'
  })
}

// [大屏]基地数量和种植面积(亩)
export const getCropBaseCount = async () => {
  return await request.get({
    url: '/agriculture/crop-base/getCropBaseCount'
  })
}

// 所有农户数量
export const getFarmerCount = async () => {
  return await request.get({
    url: '/agriculture/farmer-info/getFarmerCount'
  })
}

// 获取生长趋势折线图
export const getLineChar = async (data) => {
  const formData = new FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }
  return await request.post({
    url: '/agriculture/grow-record/getLineChar',
    headersType: 'multipart/form-data; boundary=--------------------------999028645642470077276192',
    data
  })
}

// 获取生长趋势折线图
export const aikouMonitor = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/aikouMonitor',
    params
  })
}

// 获取生长趋势折线图
export const cropBasePage = async () => {
  return await request.get({
    url: '/agriculture/crop-base/page?pageReqVO=%7B%7D'
  })
}

// 获取生长趋势折线图
export const agriWarningRecord = async (params = {}) => {
  return await request.get({
    url: '/agriculture/agri-warning-record/page',
    params
  })
}

// [大屏]基地列表
export const parkInfoPage = async () => {
  return await request.get({
    url: '/agriculture/park-info/page?pageReqVO=%7B%7D'
  })
}

// 根据基地获取监控设备列表
export const getPageMonitoring = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/getPageMonitoring',
    params
  })
}

// 商品流通分布
export const locationPrice = async () => {
  return await request.get({
    url: '/agriculture/sales-management/location/price'
  })
}

// 采收销售趋势
export const selectSum = async () => {
  return await request.get({
    url: '/agriculture/harvest-management/selectSum'
  })
}

// 设备总数、在线、离线、故障数量
export const getDeviceState = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getDeviceState'
  })
}

// [大屏]气象站/土壤传感/虫情测报灯相关读数
export const getDeviceStateByParams = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/aikouEquipmentMonitor',
    params
  })
}

// 设备分类在线离线统计
export const deviceInfoBySum = async () => {
  return await request.get({
    url: '/agriculture/big-screen/deviceInfoBySum'
  })
}

