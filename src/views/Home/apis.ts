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


// home1的接口
export const warnRecordList = () => {
  return request.get({ url: `/agriculture/agri-warning-record/list` })
}

export const deviceInfoPage = () => {
  return request.get({ url: `/agriculture/device-info/page` })
}