import request from '@/config/axios'

//基地列表
export const page = async () => {
  return await request.get({
    url:'/agriculture/park-info/page',
    
  })
}
//地块列表
export const parkPage = async (data:any) => {
  return await request.get({
    url:'/agriculture/park-detail/page',
    data
  })
}
//养殖管理
export const distribution = async (params) => {
  return await request.get({
    url:'/agriculture/crop-base/get-crop-name-distribution',
    params
  })
}
//农事计划
export const stateDistriBution = async (params) => {
  return await request.get({
    url:'/agri/farm-plan/get-plan-state-distribustion',
    params
  })
}
//投入产出分析
export const getInOrOutAnalysis = async (params) => {
  return await request.get({
    url:'/banqiao/smartStatistics/getInOrOutAnalysis',
    params
  })
}
//产量一览图
export const selectHarvest = async (params) => {
  return await request.get({
    url:'/agriculture/harvest-management/selectHarvestBanqiao',
    params
  })
}
//农事活动
export const getFarmRecordMap = async (params) => {
  return await request.get({
    url:'/agri/farm-record/getFarmRecordMap',
    params
  })
}
//收获趋势图
export const getHarvestManagementNumList = async (params) => {
  return await request.get({
    url:'/agriculture/harvest-management/getHarvestManagementNumList',
    params
  })
}