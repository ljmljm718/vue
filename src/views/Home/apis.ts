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

export const envPage = (params: any) => {
  return request.get({ url: `/agriculture/environment-data/envPage`, params })
}

export const envDataPage = (params: any) => {
  return request.get({ url: `/agriculture/environment-data/page`, params })
}


// home1的接口
export const warnRecordList = () => {
  return request.get({ url: `/agriculture/agri-warning-record/list` })
}

export const deviceInfoPage = () => {
  return request.get({ url: `/agriculture/device-info/page` })
}

export const deviceInfoByPark = () => {
  return request.get({ url: `/agriculture/big-screen/deviceInfoByPark` })
}

export const getDeviceState = () => {
  return request.get({ url: `/agriculture/big-screen/getDeviceState` })
}

export const environmentalData = () => {
  return request.get({ url: `/yyang/equipment-data/environmentalData` })
}

export const waterQualityData = () => {
  return request.get({ url: `/yyang/equipment-data/waterQualityData` })
}

export const growthPage = (params) => {
  return request.get({ url: `/agri/crop-growth/page`, params })
}

export const growthIndexCard = (params) => {
  return request.get({ url: `/agri/crop-growth/index-card`, params })
}

export const getCountPageByBaseId = (params) => {
  return request.get({ url: `/agriculture/check-logs/getCountPageByBaseId`, params })
}

export const detailListByParkId = (params) => {
  return request.get({ url: `/agriculture/park-info/park-detail/list-by-park-id`, params })
}

export const parkInfoPage = (params) => {
  return request.get({ url: `/agriculture/park-info/page`, params })
}

export const environmentalDataHomePage = () => {
  return request.get({ url: `/yyang/equipment-data/environmentalDataHomePage` })
}

export const soilPage = (params) => {
  return request.get({ url: `/agriculture/environment-data/soilPage`, params })
}

//homeBaidi 接口
export const HomeDeviceCard2 = () => {
  return request.get({ url: `/agriculture/big-screen/baidiHomeDeviceCard`,  })
}
export const ParkTree = () => {
  return request.get({ url: `/agriculture/big-screen/getParkTree`,  })
}
export const homeCheckLog = (params) => {
  return request.get({ url: `/agriculture/big-screen/homeCheckLog`,params  })
}
export const pageRealTimeData2 = (params) => {
  return request.get({ url: `/agriculture/warning-record-big-screen/pageRealTimeData2`,params  })
}
export const CountListByNowTime = (params) => {
  return request.get({ url: `/agriculture/agri-warning-record/getCountListByNowTime`,params})
}
export const pageWarningInfo2 = (params) => {
  return request.get({ url: `/agriculture/warning-record-big-screen/pageWarningInfo`,params})
}
export const environmentView = (params) => {
  return request.get({ url: `/agriculture/big-screen/environmentView`,params})
}
export const DataByParkAndPlotAndType = (params) => {
  return request.get({ url: `/agriculture/big-screen/getDeviceDataByParkAndPlotAndType`,params})
}

// 明月村项目接口
export const getEquipmentCountSum = () => {
  return request.get({ url: `/agriculture/device-info/getEquipmentCountSum`})
}

export const getInspectionProgress = (params) => {
  return request.get({ url: `/baidi/big-screen/getInspectionProgress`, params})
}

export const warningRecordInfoByCode = (params) => {
  return request.get({ url: `/agriculture/warning-record-big-screen/warningRecordInfoByCode`, params})
}

export const deviceTypeCount = (params) => {
  return request.get({ url: `/baidi/big-screen/deviceTypeCount`, params})
}

export const QueryCurrentDateCount = (params) => {
  return request.get({ url: `/yyang/equipment-data/QueryCurrentDateCount`, params})
}

export const getCountSumByCode = (params) => {
  return request.get({ url: `/agriculture/agri-warning-record/getCountSumByCode`, params})
}
//土壤
export const environmentalDataHomePageC = (params) => {
  return request.get({ url: `/yyang/equipment-data/environmentalDataHomePageC`, params})
}
//虫情
export const environmentalDataHomePageB = (params) => {
  return request.get({ url: `/yyang/equipment-data/environmentalDataHomePageB`, params})
}
//气象
export const environmentalDataHomePageA = (params) => {
  return request.get({ url: `/yyang/equipment-data/environmentalDataHomePageA`, params})
}
//水质
export const waterQualityData2 = (params) => {
  return request.get({ url: `/yyang/equipment-data/waterQualityData`, params})
}


// 塘坝 设备监测列表
export const getDeviceCategoryTree = (params) => {
  return request.get({ url: `/agriculture/big-screen/getDeviceCategoryTree`, params})
}

// 设备属性详情-根据设备id查询
export const getDeviceInfo = (params) => {
  return request.get({ url: `/agriculture/device-info/get`, params})
}

// 监测设备的统计数据[根据设备ID查询最近24小时的数据检测数据(所有检测类型)]
export const getEquipmentDataById = (params) => {
  return request.get({ url: `/yyang/equipment-data/getEquipmentDataById`, params})
}

// 监控设备的报警数据
export const getMonitorEquipNoticeList = (params) => {
  return request.get({ url: `/agriculture/monitoring-equipment-notice/getList`, params})
}


// 监测设备的报警数据
export const getWarningRecordList = (params) => {
  return request.get({ url: `/agriculture/agri-warning-record/page`, params})
}


// 监测设备的报警数据
export const deviceInfoUpdate = (data) => {
  return request.put({ url: `/agriculture/device-info/update`, data})
}

// 监控设备的实时数据
export const getDeviceById = (params) => {
  return request.get({ url: `/agri/monitoring-equipment-data/get-device-id`, params })
}


// 监控设备的报警数据
export const getNoticeList = (params) => {
  return request.get({ url: `/agriculture/monitoring-equipment-notice/getList`, params })
}

// 生长记录仪的实时数据
export const pageA = (params) => {
  return request.get({ url: `/agriculture/grow-record/pageA`, params })
}

// 长势监控折线图
export const getLineChar = (data) => {
  return request.post({ url: `/agriculture/grow-record/getLineChar`, data })
}

//获取设备时间
export const getEquipmentDataByEquipmentCode = (params) => {
  return request.get({ url: `/yyang/equipment-data/getEquipmentDataByEquipmentCode`, params })
}
//获取设备时间
export const warningRecordPage = () => {
  return request.get({ url: `/agriculture/agri-warning-record/page` })
}
//数字产销饼状图接口
export const getProduceData = () => {
  return request.get({ url: `/digital/village-product-circulation/city-list`})
}
//数字产销柱状图接口
export const getProduceList = () => {
  return request.get({ url: `/digital/village-product-circulation/product-list`})
}

//二渡获取种植面积、作物产量、销售额
export const  getAreaYieldSales =()=>{
  return request.get({url: `/agriculture/crop-base/get-area-yield-sales`})
}
//二渡获取设备总量、在线数、离线数
export const  getErduEquipmentCount =()=>{
  return request.get({url: `/agriculture/device-info/get-erdu-equipment-count`})
}
// 二渡 获取品种列表
export const getVarietyListErdu = () => {
  return request.get({ url: '/agriculture/variety-management/variety-management-list' })
}
// 二渡 根据品种ID获取建议列表
export const getAdviceByCropCodeErdu = (params) => {
  return request.get({ url: '/agri/crop-growth-new/list-for-cropCode', params })
}
//二渡 获取种植作物规模
export const getFiveYearValue = () => {
  return request.get({ url: '/agriculture/crop-base/getFiveYearValue'})
}
// 二渡 农事任务统计
export const getMissionStatisticsErdu = () => {
  return request.get({ url: '/agri/farm-plan/farmPlanStatistics' })
}