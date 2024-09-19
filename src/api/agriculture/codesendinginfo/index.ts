import request from '@/config/axios'

// 发码记录 VO
export interface CodeSendingInfoVO {
  id: string // id
  codeContent: string // 源码
  templateId: string // 模板ID
  productName: string // 产品名称
  producer: string // 生产商
  sourceArea: string // 原产地
  productCertification: string // 产品认证
  productionTime: Date // 生产时间
  codeType: string // 是否赋码
  batchNum: string // 批次号
  prepareOne: string // 备用字段
  prepareTwo: string // 备用字段
  prepareThree: string // 备用字段
  remark: string // 备注
}

// 发码记录 API
export const CodeSendingInfoApi = {
  // 查询发码记录分页
  getCodeSendingInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/code-sending-info/page`, params })
  },

  // 查询发码记录详情
  getCodeSendingInfo: async (id: number) => {
    return await request.get({ url: `/agriculture/code-sending-info/get?id=` + id })
  },

  // 新增发码记录
  createCodeSendingInfo: async (data: CodeSendingInfoVO) => {
    return await request.post({ url: `/agriculture/code-sending-info/create`, data })
  },

  // 修改发码记录
  updateCodeSendingInfo: async (data: CodeSendingInfoVO) => {
    return await request.put({ url: `/agriculture/code-sending-info/update`, data })
  },

  // 删除发码记录
  deleteCodeSendingInfo: async (id: number) => {
    return await request.delete({ url: `/agriculture/code-sending-info/delete?id=` + id })
  },

  // 导出发码记录 Excel
  exportCodeSendingInfo: async (params) => {
    return await request.download({ url: `/agriculture/code-sending-info/export-excel`, params })
  }
}