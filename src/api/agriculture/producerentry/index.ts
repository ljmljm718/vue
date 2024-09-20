import request from '@/config/axios'

// 生产商入库 VO
export interface ProducerEntryVO {
  id: string // 主键
  companyName: string // 公司名称
  legalPerson: string // 法人
  registeredAddress: string // 注册地址
  contactPhone: string // 联系方式
  registeredCapital: string // 注册资金
  socialCreditCode: string // 统一社会信用代码
  establishDate: Date // 成立时间
  businessLicense: string // 营业执照
  foodProduceLicense: string // 食品生产许可证
  approvalStatus: string // 审批状态
}

// 生产商入库 API
export const ProducerEntryApi = {
  // 查询生产商入库分页
  getProducerEntryPage: async (params: any) => {
    return await request.get({ url: `/agriculture/producer-entry/page`, params })
  },

  // 查询生产商入库详情
  getProducerEntry: async (id: number) => {
    return await request.get({ url: `/agriculture/producer-entry/get?id=` + id })
  },

  // 新增生产商入库
  createProducerEntry: async (data: ProducerEntryVO) => {
    return await request.post({ url: `/agriculture/producer-entry/create`, data })
  },

  // 修改生产商入库
  updateProducerEntry: async (data: ProducerEntryVO) => {
    return await request.put({ url: `/agriculture/producer-entry/update`, data })
  },

  // 删除生产商入库
  deleteProducerEntry: async (id: number) => {
    return await request.delete({ url: `/agriculture/producer-entry/delete?id=` + id })
  },

  // 导出生产商入库 Excel
  exportProducerEntry: async (params) => {
    return await request.download({ url: `/agriculture/producer-entry/export-excel`, params })
  },
}
