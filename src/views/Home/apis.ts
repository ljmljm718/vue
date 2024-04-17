import request from '@/config/axios'

export const homeDeviceCard = () => {
  return request.get({ url: `/agriculture/big-screen/homeDeviceCard` })
}

export const getParkTree = (params: any) => {
  return request.get({ url: `/agriculture/big-screen/getParkTree`, params })
}

export const getDeviceByParkAndPlot = (params: any) => {
  return request.get({ url: `/agriculture/big-screen/getDeviceByParkAndPlot`, params })
}

export const pageWarningInfo = (params: any) => {
  return request.get({ url: `/agriculture/warning-record-big-screen/pageWarningInfo`, params })
}

export const pageRealTimeData = (params: any) => {
  return request.get({ url: `/agriculture/warning-record-big-screen/pageRealTimeData`, params })
}

export const envPage = (params: any) => {
  return request.get({ url: `/agriculture/environment-data/envPage`, params })
}

export const envDataPage = (params: any) => {
  return request.get({ url: `/agriculture/environment-data/page`, params })
}


// home1的接口
export const warnRecordList = () => {
  return request.get({ url: `/agriculture/agri-warning-record/list` })
}

export const deviceInfoPage = () => {
  return request.get({ url: `/agriculture/device-info/page` })
}

export const deviceInfoByPark = () => {
  return request.get({ url: `/agriculture/big-screen/deviceInfoByPark` })
}

export const getDeviceState = () => {
  return request.get({ url: `/agriculture/big-screen/getDeviceState` })
}

export const environmentalData = () => {
  return request.get({ url: `/yyang/equipment-data/environmentalData` })
}

export const waterQualityData = () => {
  return request.get({ url: `/yyang/equipment-data/waterQualityData` })
}

export const growthPage = (params) => {
  return request.get({ url: `/agri/crop-growth/page`, params })
}

export const getCountPageByBaseId = (params) => {
  return request.get({ url: `/agriculture/check-logs/getCountPageByBaseId`, params })
}

export const detailListByParkId = (params) => {
  return request.get({ url: `/agriculture/park-info/park-detail/list-by-park-id`, params })
}

export const parkInfoPage = (params) => {
  return request.get({ url: `/agriculture/park-info/page`, params })
}

export const environmentalDataHomePage = () => {
  return request.get({ url: `/yyang/equipment-data/environmentalDataHomePage` })
}

export const soilPage = (params) => {
  return request.get({ url: `/agriculture/environment-data/soilPage`, params })
}

//homeBaidi 接口
export const HomeDeviceCard2 = () => {
  return request.get({ url: `/agriculture/big-screen/baidiHomeDeviceCard`,  })
}
export const ParkTree = () => {
  return request.get({ url: `/agriculture/big-screen/getParkTree`,  })
}
export const homeCheckLog = (params) => {
  return request.get({ url: `/agriculture/big-screen/homeCheckLog`,params  })
}
export const pageRealTimeData2 = (params) => {
  return request.get({ url: `/agriculture/warning-record-big-screen/pageRealTimeData2`,params  })
}
export const CountListByNowTime = (params) => {
  return request.get({ url: `/agriculture/agri-warning-record/getCountListByNowTime`,params})
}
export const pageWarningInfo2 = (params) => {
  return request.get({ url: `/agriculture/warning-record-big-screen/pageWarningInfo`,params})
}
export const environmentView = (params) => {
  return request.get({ url: `/agriculture/big-screen/environmentView`,params})
}
export const DataByParkAndPlotAndType = (params) => {
  return request.get({ url: `/agriculture/big-screen/getDeviceDataByParkAndPlotAndType`,params})
}
