import request from '@/config/axios'

// 因素评分规则 VO
export interface OxygenRuleVO {
  id: string // 主键
  maxNum: string // 最大值
  minNum: string // 最小值
  scoreNum: string // 评分值
  targetNum: string // 目标分值
  suggestText: string // 调整建议
  suggestNum: string // 建议功率
  equipId: string // 增氧设备ID
  equipjianId: string // 监测设备ID
  baseId: string // 基地ID
  plotId: string // 地块ID
  oxygenId: string // 因素ID
  warnStatus: string // 是否警告
  warnContent: string // 警告内容
  remark: string // 备注
}

// 因素评分规则 API
export const OxygenRuleApi = {
  // 查询因素评分规则分页
  getOxygenRulePage: async (params: any) => {
    return await request.get({ url: `/agriculture/oxygen-rule/page`, params })
  },

  // 查询因素评分规则详情
  getOxygenRule: async (id: number) => {
    return await request.get({ url: `/agriculture/oxygen-rule/get?id=` + id })
  },

  // 新增因素评分规则
  createOxygenRule: async (data: OxygenRuleVO) => {
    return await request.post({ url: `/agriculture/oxygen-rule/create`, data })
  },

  // 修改因素评分规则
  updateOxygenRule: async (data: OxygenRuleVO) => {
    return await request.put({ url: `/agriculture/oxygen-rule/update`, data })
  },

  // 删除因素评分规则
  deleteOxygenRule: async (id: number) => {
    return await request.delete({ url: `/agriculture/oxygen-rule/delete?id=` + id })
  },

  // 导出因素评分规则 Excel
  exportOxygenRule: async (params) => {
    return await request.download({ url: `/agriculture/oxygen-rule/export-excel`, params })
  }
}