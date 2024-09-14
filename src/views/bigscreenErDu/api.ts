import request from '@/config/axios'

export const exam = async () => {
  return request.get({ url: '/exam'})
}

// 二渡 大屏智慧农事 农业资源
export const getQianjiangAgriResource = () => {
  return request.get({ url: '/agriculture/big-screen/getQianjiangAgriResource' })
}

// 二渡 大屏智慧农事 种养品种
export const getVarietyManagement = () => {
  return request.get({ url: '/agriculture/variety-management/page' })
}

// 二渡 大屏智慧农事 品种分布
export const getBreedCategory = () => {
  return request.get({ url: '/agri/farm-overview/get-breedCategory' })
}
// 二渡 大屏智慧农事 中上设备
export const qjDeviceStatistics = () => {
  return request.get({ url: '/agriculture/big-screen/qjDeviceStatistics' })
}

// 二渡 大屏智慧农业 设备信息
export const getDeviceInfo = () => {
  return request.get({ url: '/agriculture/big-screen/deviceInfoCard' })
}
//二渡 大屏智慧农业 种养信息
export const cropBase = async ( params) => {
  return request.get({ 
    url: '/agriculture/crop-base/page',
    params
  })
}
//二渡 大屏智慧农业 预警信息
export const warnRecordInfo = async() =>{
  return request.get({
    url:'/agriculture/warning-record-big-screen/qianjiangWarnRecordInfo'
  })
}

// 二渡 大屏智慧农业 获取全部基地
export const getAllBase = async() =>{
  return request.get({ url:'/agriculture/park-info/getAll' })
}

// 二渡 大屏智慧农业 根据基地ID获取地块列表
export const getAllPlotByBaseID = async(params) =>{
  return request.get({ url:'/agri/land-display/park-list', params })
}

// 二渡 大屏智慧农业 获取农事任务
export const getAgriMissionPlan = async(params) =>{
  return request.get({ url:'/agri/farm-plan/farmPlanSchedule', params })
}
