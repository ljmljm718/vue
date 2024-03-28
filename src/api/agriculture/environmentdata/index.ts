import request from '@/config/axios'

// 环境数据 VO
export interface EnvironmentDataVO {
  equipmentCode: string // 设备编号
  temperature: string // 温度
  humidity: string // 湿度
  lighting: string // 光照
  windSpeed: string // 风速
  rainfall: string // 降雨量
  co2Density: string // 二氧化碳浓度
  collectionTime: Date // 数据上报时间
  deviceType: string // 设备类型
  airPressure: string // 大气压力
}

// 环境数据 API
export const EnvironmentDataApi = {
  // 查询环境数据分页
  getEnvironmentDataPage: async (params: any) => {
    return await request.get({ url: `/agriculture/environment-data/page`, params })
  },

  // 查询环境数据详情
  getEnvironmentData: async (id: number) => {
    return await request.get({ url: `/agriculture/environment-data/get?id=` + id })
  },

  // 新增环境数据
  createEnvironmentData: async (data: EnvironmentDataVO) => {
    return await request.post({ url: `/agriculture/environment-data/create`, data })
  },

  // 修改环境数据
  updateEnvironmentData: async (data: EnvironmentDataVO) => {
    return await request.put({ url: `/agriculture/environment-data/update`, data })
  },

  // 删除环境数据
  deleteEnvironmentData: async (id: number) => {
    return await request.delete({ url: `/agriculture/environment-data/delete?id=` + id })
  },

  // 导出环境数据 Excel
  exportEnvironmentData: async (params) => {
    return await request.download({ url: `/agriculture/environment-data/export-excel`, params })
  },
}
