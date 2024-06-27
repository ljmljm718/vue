import request from '@/config/axios'

// 认养规则 VO
export interface AdoptionRuleVO {
  id: string // 主键id
  ruleNumber: string // 规则流水号
  planNumber: string // 计划流水号
  ruleType: string // 规则类型
  ruleOverview: string // 规则概述
  ruleDescribe: string // 具体说明
  remark: string // 备注
}

// 认养规则 API
export const AdoptionRuleApi = {
  // 查询认养规则分页
  getAdoptionRulePage: async (params: any) => {
    return await request.get({ url: `/agriculture/adoption-rule/page`, params })
  },

  // 查询认养规则详情
  getAdoptionRule: async (id: number) => {
    return await request.get({ url: `/agriculture/adoption-rule/get?id=` + id })
  },

  // 查询认养规则详情
  getAdoptionRuleByPlanNumber: async (planId: any) => {
    return await request.get({ url: `/agriculture/adoption-rule/getplan?plan=` + planId })
  },

  // 新增认养规则
  createAdoptionRule: async (data: AdoptionRuleVO) => {
    return await request.post({ url: `/agriculture/adoption-rule/create`, data })
  },

  // 修改认养规则
  updateAdoptionRule: async (data: AdoptionRuleVO) => {
    return await request.put({ url: `/agriculture/adoption-rule/update`, data })
  },

  // 删除认养规则
  deleteAdoptionRule: async (id: number) => {
    return await request.delete({ url: `/agriculture/adoption-rule/delete?id=` + id })
  },

  // 导出认养规则 Excel
  exportAdoptionRule: async (params) => {
    return await request.download({ url: `/agriculture/adoption-rule/export-excel`, params })
  },

// ==================== 子表（认养规则规格） ====================

  // 获得认养规则规格列表
  getAdoptionRuleSpecsListByRuleNumber: async (ruleNumber) => {
    return await request.get({ url: `/agriculture/adoption-rule/adoption-rule-specs/list-by-rule-number?ruleNumber=` + ruleNumber })
  }
}
