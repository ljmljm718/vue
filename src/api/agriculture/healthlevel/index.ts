import request from '@/config/axios'

// 健康等级 VO
export interface HealthLevelVO {
  cropCode: string // 品种id
  cropName: string // 品种名称
  healthLevel: string // 健康等级
  max: string // 健康等级上限分
  min: string // 健康等级下限分
  modelId: string // 模型ID
  modelName: string // 模型名称
}

// 健康等级 API
export const HealthLevelApi = {
  // 查询健康等级分页
  getHealthLevelPage: async (params: any) => {
    return await request.get({ url: `/agriculture/health-level/page`, params })
  },

  // 查询健康等级详情
  getHealthLevel: async (id: number) => {
    return await request.get({ url: `/agriculture/health-level/get?id=` + id })
  },

  // 新增健康等级
  createHealthLevel: async (data: HealthLevelVO) => {
    return await request.post({ url: `/agriculture/health-level/create`, data })
  },

  // 修改健康等级
  updateHealthLevel: async (data: HealthLevelVO) => {
    return await request.put({ url: `/agriculture/health-level/update`, data })
  },

  // 删除健康等级
  deleteHealthLevel: async (id: number) => {
    return await request.delete({ url: `/agriculture/health-level/delete?id=` + id })
  },

  // 导出健康等级 Excel
  exportHealthLevel: async (params) => {
    return await request.download({ url: `/agriculture/health-level/export-excel`, params })
  },
}