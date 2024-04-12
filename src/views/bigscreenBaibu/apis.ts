import request from '@/config/axios'

// 左一-产业介绍-产业统计
export const industryStatistics = async () => {
  return await request.get({
    url: '/agriculture/big-screen/industryStatistics'
  })
}

// 左一-产业介绍-基地信息
export const baidiParkInfo = async () => {
  return await request.get({
    url: '/agriculture/big-screen/baidiParkInfo'
  })
}

// 右三-监控设备
export const monitorDeviceByParkId = async (data) => {
  return await request.post({
    url: '/agriculture/device-info/getPageMonitoring',
    data,
    headersType: 'multipart/form-data; boundary=--------------------------999028645642470077276192',
  })
}

// 右三-监控设备
// export const warningRecordInfo = async () => {
//   return await request.get({
//     url: '/agriculture/warning-record-big-screen/warningRecordInfo'
//   })
// }

// 左二-长势分析
export const getLineChar = async (data) => {
  return await request.post({
    url: '/agriculture/grow-record/getLineChar',
    data
  })
}

// 右二-上部分-环境监测
// export const baibuTypeMonitor = async (data) => {
//   return await request.post({
//     url: '/yyang/equipment-data/baibuTypeMonitor',
//     data
//   })
// }

// --------------------------------------------------------------
// [大屏]基地数量和种植面积(亩)
export const getParkCountAndAreaSum = async () => {
  return await request.get({
    url: '/agriculture/device-info/getParkCountAndAreaSum'
  })
}

// lkh-所有品种数量
export const getCropBaseCount = async () => {
  return await request.get({
    url: '/agriculture/crop-base/getCropBaseCount'
  })
}

// lkh-左上-产品介绍-品种管理
export const getCropBaseList = async (params) => {
  return await request.get({
    url: '/agriculture/crop-base/page',
    params
  })
}

// [大屏]烘干工艺 没调完
export const managementPage = async (params) => {
  return await request.get({
    url: '/baibu/drying-process-management/page',
    params
  })
}

// 工程设备分类统计
export const deviceInfoBySumType = async () => {
  return await request.get({
    url: '/agriculture/big-screen/deviceInfoBySumType'
  })
}

// 【中下一】商品流通分布
export const locationPrice = async () => {
  return await request.get({
    url: '/agriculture/sales-management/location/price'
  })
}

// 右一-设备分类在线离线统计
export const deviceInfoBySum = async () => {
  return await request.get({
    url: '/agriculture/big-screen/deviceInfoBySum'
  })
}

// 右二-1号设备，设备查询
export const getDeviceForPark = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getDeviceForPark',
    params
  })
}

// 地块查询
export const parkDetailPage = async () => {
  return await request.get({
    url: '/agriculture/park-detail/page'
  })
}


// [右二、右三、右四]环境/土壤/虫情监测数据查询
export const baibuTypeMonitor = async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/baibuTypeMonitor',
    params
  })
}

// [右二、右三、右四]环境/土壤/虫情监测数据查询
export const parkInfoPage = async (params = {}) => {
  return await request.get({
    url: '/agriculture/park-info/page',
    params
  })
}

// 右三-监控设备
export const warningRecordInfo = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/warningRecordInfo'
  })
}

// 右四-子设备名称和状态查询
export const subDevicePage = async () => {
  return await request.get({
    url: '/agriculture/sub-device/page'
  })
}

// 右四-子设备名称和状态查询
export const subDeviceUpdate = async (data) => {
  return await request.put({
    url: '/agriculture/sub-device/update',
    data
  })
}

export const arrayFormatter = (array = [], subGroupLength = 2) => {
  let index = 0;
  const newArray:any = [];
  while(index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}