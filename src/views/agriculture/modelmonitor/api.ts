import request from '@/config/axios'
export const baidiParkInfo = async () => {
  return await request.get({
    url: '/agriculture/big-screen/baidiParkInfo'
  })
}

export const getModelByParkId = async (params)=>{
  return await request.get({
    url:'/agriculture/model-management/getModelByParkId',
    params
  })
}

export const getModelInfo = async (params)=>{
  return await request.get({
    url:'/agri/crop-growth-new/get-modelInfo',
    params
  })
}

export const getMonitorIndicatorWithDetail = async (params)=>{
  return await request.get({
    url:'/agriculture/model-monitor-indicator/getMonitorIndicatorWithDetail',
    params
  })
}