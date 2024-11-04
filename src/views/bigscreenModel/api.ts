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
//左上监测
export const modelMonitor = async (params) =>{
  return await request.get({
    url:'/agriculture/model-monitor-execution-growth/model-monitor',
    params
  })
}
//中间下方折线图
export const ModelOverviewStatistics = async (params) =>{
  return await request.get({
    url:'/agriculture/model-monitor-execution-day/getModelOverviewStatistics',
    params
  })
}
//中间下方折线图
export const BatchCodeByModelId = async (params) =>{
  return await request.get({
    url:'/agriculture/model-management/getBatchCodeByModelId',
    params
  })
}