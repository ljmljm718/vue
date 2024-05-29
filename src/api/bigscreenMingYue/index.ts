import request from '@/config/axios'

//基地导览
export const getParkTree = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getParkTree',
  })
}

export const EquipmentPhotographAndVideo = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentPhotographAndVideo',
    params
  })
}
export const getPage = async (params) => {
  return await request.get({
    url: '/agriculture/monitoring-equipment-notice/page',
    params
  })
}


//风险预警
export const fulingWarningDistr = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/fulingWarningDistr',
  })
}
export const getPestLevelChart = async () => {
  return await request.get({
    url: '/yyang/equipment-data/getPestLevelChart?size=7',
  })
}
export const fulingWarningInfo = async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/fulingWarningInfo?parkId=1787662656362246144&plotId=1787662656924282881',
  })
}
export const listAll = async () => {
  return await request.get({
    url: '/agri/farm-define/listAll',
  })
}
export const warningNum = async () => {
  return await request.get({
    url: '/agriculture/agri-warning-record/warningNum',
  })
}
export const page = async () => {
  return await request.get({
    url: '/agriculture/agri-warning-record/page?warnStatus=0',
  })
}
export const pageW = async (params) => {
  return await request.get({
    url: '/agri/farm-plan/pageW',
    params
  })
}


//智慧种植
export const getPondCountFrySum= async () => {
  return await request.get({
    url: '/agri/duck-house-management/getPondCountFrySum',
  })
}
export const getCountRiceDuckSum= async () => {
  return await request.get({
    url: '/agri/duck-house-management/getCountRiceDuckSum',
  })
}
export const selectCount= async () => {
  return await request.get({
    url: '/agriculture/park-info/selectCount',
  })
}
export const getLineChar= async (params) => {
  return await request.post({
    url: '/agriculture/grow-record/getLineChar',
    params
  })
}
export const selectHarvest= async () => {
  return await request.get({
    url: '/agriculture/harvest-management/selectHarvest',
   
  })
}
export const getEquipmentCountSum= async () => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentCountSum',
   
  })
}
export const getEquipmentCountSumOrderByType= async () => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentCountSumOrderByType',
   
  })
}
export const maiFootPage= async () => {
  return await request.get({
    url: '/digital/village-product/page',
   
  })
}
export const basePage= async (params) => {
  return await request.get({
    url: '/agriculture/park-info/page',
    params
  })
}
export const plotPage= async (params) => {
  return await request.get({
    url: '/agriculture/park-detail/page',
    params
  })
}
export const environmentalDataHomePageB= async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/environmentalDataHomePageB',
    params
  })
}
export const environmentalDataHomePageC= async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/environmentalDataHomePageC',
    params
  })
}
export const environmentalDataHomePageA= async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/environmentalDataHomePageA',
    params
  })
}
export const waterQualityData= async (params) => {
  return await request.get({
    url: '/yyang/equipment-data/waterQualityData',
    params
  })
}