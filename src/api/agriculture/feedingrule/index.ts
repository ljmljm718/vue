import request from '@/config/axios'

// 投喂规则 VO
export interface FeedingRuleVO {
  id: string // id
  growthPeriod: string // 生长期
  weight: string // 重量
  quantity: string // 数量
  baseNumber: string // 基数
  strategy: string // 策略
}

// 投喂规则 API
export const FeedingRuleApi = {
  // 查询投喂规则分页
  getFeedingRulePage: async (params: any) => {
    return await request.get({ url: `/agriculture/feeding-rule/page`, params })
  },

  // 查询投喂规则详情
  getFeedingRule: async (id: number) => {
    return await request.get({ url: `/agriculture/feeding-rule/get?id=` + id })
  },

  // 新增投喂规则
  createFeedingRule: async (data: FeedingRuleVO) => {
    return await request.post({ url: `/agriculture/feeding-rule/create`, data })
  },

  // 修改投喂规则
  updateFeedingRule: async (data: FeedingRuleVO) => {
    return await request.put({ url: `/agriculture/feeding-rule/update`, data })
  },

  // 删除投喂规则
  deleteFeedingRule: async (id: number) => {
    return await request.delete({ url: `/agriculture/feeding-rule/delete?id=` + id })
  },

  // 导出投喂规则 Excel
  exportFeedingRule: async (params) => {
    return await request.download({ url: `/agriculture/feeding-rule/export-excel`, params })
  },
}