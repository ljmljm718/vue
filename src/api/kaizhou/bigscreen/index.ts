import request from '@/config/axios'

//中间-设备数量统计
export const deviceStatistics = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/deviceStatistics',
  })
}
//物联设备数据 选择园区
export const ParkBaseInfo = async (params:any) => {
  return await request.get({
    url: 'kaizhou/big-screen/getParkBaseInfo',
    params
  })
}
//物联设备数据 选择园区
export const ParkBaseInfo2 = async (params:any) => {
  return await request.get({
    url: 'kaizhou/big-screen/getParkBaseInfo',
    params
  })
}

//物联设备数据 设备信息
export const IoTLatestData = async (params:any) => {
  return await request.get({
    url: 'kaizhou/big-screen/getIoTLatestData',
    params
  })
}
//产品介绍
export const cropBase = async (params:any) => {
  return await request.get({
    url: 'kaizhou/big-screen/cropBase',
    params
  })
}
//种植资源左侧
export const PlantInfo = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getPlantInfo',
    
  })
}
//种植资源右侧
export const PlantArea = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getPlantArea',
    
  })
}
//地图-设备与预警信息
export const DeviceAndWarn = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getDeviceAndWarn',
    
  })
}
//柑橘生产数据分析
export const ProductionData = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getProductionData',
    
  })
}
//预警信息
export const WarnInfo = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getWarnInfo',
    
  })
}
//销售分析
export const YearSaleData = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getYearSaleData',
    
  })
}
//柑橘产量/销售趋势分析
export const MonthSaleData = async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getMonthSaleData',
    
  })
}
//柑橘产量/销售趋势分析
export const  LuYu= async () => {
  return await request.get({
    url: 'kaizhou/warning-record/getLuYu',
    
  })
}
//柑橘产量/销售趋势分析
export const  IndustryData= async () => {
  return await request.get({
    url: 'kaizhou/big-screen/getIndustryData',
    
  })
}
