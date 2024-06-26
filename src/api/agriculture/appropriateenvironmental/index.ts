import request from '@/config/axios'

// 适宜环境 VO
export interface ropriateEnvironmentalVO {
  id: string // 主键
  name: string // 名称
  growthPeriod: string // 生长期
  monitoringType: string // 监测类型
  optimalTemperature: string // 适宜温度
}

// 适宜环境 API
export const ropriateEnvironmentalApi = {
  // 查询适宜环境分页
  getropriateEnvironmentalPage: async (params: any) => {
    return await request.get({ url: `/app/ropriate-environmental/page`, params })
  },

  // 查询适宜环境详情
  getropriateEnvironmental: async (id: number) => {
    return await request.get({ url: `/app/ropriate-environmental/get?id=` + id })
  },

  // 新增适宜环境
  createropriateEnvironmental: async (data: ropriateEnvironmentalVO) => {
    return await request.post({ url: `/app/ropriate-environmental/create`, data })
  },

  // 修改适宜环境
  updateropriateEnvironmental: async (data: ropriateEnvironmentalVO) => {
    return await request.put({ url: `/app/ropriate-environmental/update`, data })
  },

  // 删除适宜环境
  deleteropriateEnvironmental: async (id: number) => {
    return await request.delete({ url: `/app/ropriate-environmental/delete?id=` + id })
  },

  // 导出适宜环境 Excel
  exportropriateEnvironmental: async (params) => {
    return await request.download({ url: `/app/ropriate-environmental/export-excel`, params })
  }
}