import request from '@/config/axios'

//获取顶部基本信息
// export const getBasicInfo = async(params)=>{
//   return await request.get({
//     url:'/yyang/equipment-data/get-oxygen-equipment-list',
//     params
//   })
// }

//获取基地列表
export const getParkInfoPage = async()=>{
  return await request.get({
    url:'/agriculture/park-info/page',
    
  })
}
//获取地块列表
export const getParkDetailPage = async(params)=>{
  return await request.get({
    url:'/agriculture/park-detail/page',
    params
  })
}
//获取设备
export const getDissolvedOxygenEquipmentList = async(params)=>{
  return await request.get({
    url:'/agriculture/device-info/get-dissolved-oxygen-equipment-list',
    params
  })
}

//获取当前功率
export const getCurrentPower = async(params)=>{
  return await request.get({
    url:'/agriculture/sub-device/parameter/value',
    params
  })
}
//获取评分
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
//溶解氧当前值
export const getCurrentDO = async(params)=>{
  return await request.get({
    url:'/yyang/equipment-data/get-equipment-date-by-equipment-id',
    params
  })
}
//溶解氧标准值
export const getRopriateEnvironmentalByDissolvedOxygen = async()=>{
  return await request.get({
    url:'/app/ropriate-environmental/get-ropriate-environmental-by-dissolved-oxygen',
    
  })
}