import request from '@/config/axios'

// 预警规则 VO
export interface WarningRuleVO {
  id: number // 主键
  ruleType: string // 规则类型
  warnLowValue: string // 预警下限
  warnHighValue: string // 预警上限
  warnUnit: string // 单位
  lowMsgTemplateId: string // 低位预警消息模板
  highMsgTemplateId: string // 高位预警消息模板
  responsiblePersonId: string // 责任人编号
  responsiblePerson: string // 责任人
  effectiveStatus: string // 生效状态（0-未生效，1-生效）
}

// 预警规则 API
export const WarningRuleApi = {
  // 查询预警规则分页
  getWarningRulePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/warning-rule/page`, params })
  },

  // 查询预警规则详情
  getWarningRule: async (id: number) => {
    return await request.get({ url: `/kaizhou/warning-rule/get?id=` + id })
  },

  // 新增预警规则
  createWarningRule: async (data: WarningRuleVO) => {
    return await request.post({ url: `/kaizhou/warning-rule/create`, data })
  },

  // 修改预警规则
  updateWarningRule: async (data: WarningRuleVO) => {
    return await request.put({ url: `/kaizhou/warning-rule/update`, data })
  },

  // 删除预警规则
  deleteWarningRule: async (id: number) => {
    return await request.delete({ url: `/kaizhou/warning-rule/delete?id=` + id })
  },

  // 导出预警规则 Excel
  exportWarningRule: async (params) => {
    return await request.download({ url: `/kaizhou/warning-rule/export-excel`, params })
  },
}