import request from '@/config/axios'

// 码申请 VO
export interface CodeApplyVO {
  id: string // id
  applyName: string // 申请名称
  applyNumber: string // 申请数量
  applyDescribe: string // 申请描述
  sourceId: string // 溯源模版
  ruleId: string // 码规则
  applyStatus: string // 状态（制单/待发码/已发码）
  remark: string // 备注
}

// 码申请 API
export const CodeApplyApi = {
  // 查询码申请分页
  getCodeApplyPage: async (params: any) => {
    return await request.get({ url: `/agriculture/code-apply/page`, params })
  },

  // 查询码申请详情
  getCodeApply: async (id: number) => {
    return await request.get({ url: `/agriculture/code-apply/get?id=` + id })
  },

  // 新增码申请
  createCodeApply: async (data: CodeApplyVO) => {
    return await request.post({ url: `/agriculture/code-apply/create`, data })
  },

  // 修改码申请
  updateCodeApply: async (data: CodeApplyVO) => {
    return await request.put({ url: `/agriculture/code-apply/update`, data })
  },

  // 删除码申请
  deleteCodeApply: async (id: number) => {
    return await request.delete({ url: `/agriculture/code-apply/delete?id=` + id })
  },

  // 导出码申请 Excel
  exportCodeApply: async (params) => {
    return await request.download({ url: `/agriculture/code-apply/export-excel`, params })
  },
}
