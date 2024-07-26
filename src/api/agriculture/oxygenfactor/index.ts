import request from '@/config/axios'

// 溶解氧因素 VO
export interface OxygenFactorVO {
  id: string // 主键
  factorName: string // 因素名称
  factorCode: string // 因素编码
  nameDatabase: string // 数据库名称
  remark: string // 备注
  impactIndicator: string // 影响指标
}

// 溶解氧因素 API
export const OxygenFactorApi = {
  // 查询溶解氧因素分页
  getOxygenFactorPage: async (params: any) => {
    return await request.get({ url: `/agriculture/oxygen-factor/page`, params })
  },

  // 查询溶解氧因素详情
  getOxygenFactor: async (id: number) => {
    return await request.get({ url: `/agriculture/oxygen-factor/get?id=` + id })
  },

  // 新增溶解氧因素
  createOxygenFactor: async (data: OxygenFactorVO) => {
    return await request.post({ url: `/agriculture/oxygen-factor/create`, data })
  },

  // 修改溶解氧因素
  updateOxygenFactor: async (data: OxygenFactorVO) => {
    return await request.put({ url: `/agriculture/oxygen-factor/update`, data })
  },

  // 删除溶解氧因素
  deleteOxygenFactor: async (id: number) => {
    return await request.delete({ url: `/agriculture/oxygen-factor/delete?id=` + id })
  },

  // 导出溶解氧因素 Excel
  exportOxygenFactor: async (params) => {
    return await request.download({ url: `/agriculture/oxygen-factor/export-excel`, params })
  },
}