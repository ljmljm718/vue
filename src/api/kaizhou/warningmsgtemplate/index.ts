import request from '@/config/axios'

// 预警消息模板 VO
export interface WarningMsgTemplateVO {
  id: number // 主键
  msgTitle: string // 消息标题
  msgContent: string // 消息内容
  msgType: string // 消息类型
  msgLevel: string // 消息级别
  remark: string // 备注
}

// 预警消息模板 API
export const WarningMsgTemplateApi = {
  // 查询预警消息模板分页
  getWarningMsgTemplatePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/warning-msg-template/page`, params })
  },

  // 查询预警消息模板详情
  getWarningMsgTemplate: async (id: number) => {
    return await request.get({ url: `/kaizhou/warning-msg-template/get?id=` + id })
  },

  // 新增预警消息模板
  createWarningMsgTemplate: async (data: WarningMsgTemplateVO) => {
    return await request.post({ url: `/kaizhou/warning-msg-template/create`, data })
  },

  // 修改预警消息模板
  updateWarningMsgTemplate: async (data: WarningMsgTemplateVO) => {
    return await request.put({ url: `/kaizhou/warning-msg-template/update`, data })
  },

  // 删除预警消息模板
  deleteWarningMsgTemplate: async (id: number) => {
    return await request.delete({ url: `/kaizhou/warning-msg-template/delete?id=` + id })
  },

  // 导出预警消息模板 Excel
  exportWarningMsgTemplate: async (params) => {
    return await request.download({ url: `/kaizhou/warning-msg-template/export-excel`, params })
  },
}