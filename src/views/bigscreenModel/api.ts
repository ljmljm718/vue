import request from '@/config/axios'

//地块列表
export const ModelPlanByModelId = async (params) =>{
  return await request.get({
    url:'/agriculture/model-management/getModelPlanByModelId',
    params
  })
}
//中间生长周期-周期事项，跟左下共用，
export const modelInfo = async (params) =>{
  return await request.get({
    url:'/agri/crop-growth-new/get-modelInfo',
    params
  })
}
//模型要素
export const MonitorIndicatorWithDetail = async (params) =>{
  return await request.get({
    url:'/agriculture/model-monitor-indicator/getMonitorIndicatorWithDetail',
    params
  })
}
//地块信息
export const CropPlotByModelId = async (params) =>{
  return await request.get({
    url:'/agriculture/model-management/getCropPlotByModelId',
    params
  })
}