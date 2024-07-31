import request from '@/config/axios'

//获取顶部基本信息
export const getBasicInfo = async(params)=>{
  return await request.get({
    url:'/yyang/equipment-data/get-oxygen-equipment-list',
    params
  })
}
export const getCurrentPower = async(params)=>{
  return await request.get({
    url:'/agriculture/sub-device/parameter/value',
    params
  })
}
export const getOxygenRuleInfo = async(params)=>{
  return await request.get({
    url:'/agriculture/oxygen-rule/getOxygenRuleInfo',
    params
  })
}
export const getlineChartData = async(params)=>{
  return await request.get({
    url:'/yyang/equipment-data/get-real-time-scoring',
    params
  })
}
