import request from '@/config/axios'

// 溯源模板 VO
export interface TraceTemplateVO {
  id: string // 主键
  templateName: string // 模板名称
  mfrsId: string // 生产商id
  origin: string // 产地
  brandId: string // 适用品牌
  headerImg: string // 头部宣传图
  productImg: string // 产品展示图片
  remark: string // 备注
  remark1: string // 备注1
}

// 溯源模板 API
export const TraceTemplateApi = {
  // 查询溯源模板分页
  getTraceTemplatePage: async (params: any) => {
    return await request.get({ url: `/agriculture/trace-template/page`, params })
  },

  // 查询溯源模板全部
  getTraceTemplateAll: async (params: any) => {
    return await request.get({ url: `/agriculture/trace-template/all`, params })
  },

  // 查询溯源模板详情
  getTraceTemplate: async (id: number) => {
    return await request.get({ url: `/agriculture/trace-template/get?id=` + id })
  },

  // 新增溯源模板
  createTraceTemplate: async (data: TraceTemplateVO) => {
    return await request.post({ url: `/agriculture/trace-template/create`, data })
  },

  // 修改溯源模板
  updateTraceTemplate: async (data: TraceTemplateVO) => {
    return await request.put({ url: `/agriculture/trace-template/update`, data })
  },

  // 删除溯源模板
  deleteTraceTemplate: async (id: number) => {
    return await request.delete({ url: `/agriculture/trace-template/delete?id=` + id })
  },

  // 导出溯源模板 Excel
  exportTraceTemplate: async (params) => {
    return await request.download({ url: `/agriculture/trace-template/export-excel`, params })
  },

  // 发码扫码溯源
  getCodeSendingInfoAndCreatTraceRecord: async (params) => {
    return await request.get({ url: '/agriculture/code-sending-info/getCodeSendingInfoAndCreatTraceRecord', params })
  }
}
