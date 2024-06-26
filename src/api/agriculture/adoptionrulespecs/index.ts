import request from '@/config/axios'

// 认养规则规格 VO
export interface AdoptionRuleSpecsVO {
  id: string // 主键id
  ruleNumber: string // 认养规则流水号
  specsNumber: string // 规格流水号
  ruleType: string // 规则类型
  specs: string // 规格
  singlePrice: number // 单价
  servingNumber: string // 份数
  servingAmount: string // 每份数量
  remark: string // 备注
}

// 认养规则规格 API
export const AdoptionRuleSpecsApi = {
  // 查询认养规则规格分页
  getAdoptionRuleSpecsPage: async (params: any) => {
    return await request.get({ url: `/agriculture/adoption-rule-specs/page`, params })
  },

  // 查询认养规则规格详情
  getAdoptionRuleSpecs: async (id: number) => {
    return await request.get({ url: `/agriculture/adoption-rule-specs/get?id=` + id })
  },

  // 新增认养规则规格
  createAdoptionRuleSpecs: async (data: AdoptionRuleSpecsVO) => {
    return await request.post({ url: `/agriculture/adoption-rule-specs/create`, data })
  },

  // 修改认养规则规格
  updateAdoptionRuleSpecs: async (data: AdoptionRuleSpecsVO) => {
    return await request.put({ url: `/agriculture/adoption-rule-specs/update`, data })
  },

  // 删除认养规则规格
  deleteAdoptionRuleSpecs: async (id: number) => {
    return await request.delete({ url: `/agriculture/adoption-rule-specs/delete?id=` + id })
  },

  // 导出认养规则规格 Excel
  exportAdoptionRuleSpecs: async (params) => {
    return await request.download({ url: `/agriculture/adoption-rule-specs/export-excel`, params })
  }
}
