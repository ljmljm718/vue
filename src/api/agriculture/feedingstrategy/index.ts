import request from '@/config/axios'

// 投喂策略 VO
export interface FeedingStrategyVO {
  id: string // 主键
  growthPeriod: string // 生长期
  time: string // 时间
  cycle: string // 周期
  feedingFrequency: string // 投喂频率
  feedingTime: string // 投喂时间
  precautions: string // 注意事项
  feedingAdvice: string // 投喂建议
  feedingFood: string // 投喂饲料
}

// 投喂策略 API
export const FeedingStrategyApi = {
  // 查询投喂策略分页
  getFeedingStrategyPage: async (params: any) => {
    return await request.get({ url: `/agriculture/feeding-strategy/page`, params })
  },

  // 查询投喂策略详情
  getFeedingStrategy: async (id: number) => {
    return await request.get({ url: `/agriculture/feeding-strategy/get?id=` + id })
  },

  // 新增投喂策略
  createFeedingStrategy: async (data: FeedingStrategyVO) => {
    return await request.post({ url: `/agriculture/feeding-strategy/create`, data })
  },

  // 修改投喂策略
  updateFeedingStrategy: async (data: FeedingStrategyVO) => {
    return await request.put({ url: `/agriculture/feeding-strategy/update`, data })
  },

  // 删除投喂策略
  deleteFeedingStrategy: async (id: number) => {
    return await request.delete({ url: `/agriculture/feeding-strategy/delete?id=` + id })
  },

  // 导出投喂策略 Excel
  exportFeedingStrategy: async (params) => {
    return await request.download({ url: `/agriculture/feeding-strategy/export-excel`, params })
  },
}