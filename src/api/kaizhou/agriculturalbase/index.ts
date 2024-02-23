import request from '@/config/axios'

// 农资基础信息 VO
export interface AgriculturalBaseVO {
  id: number // 主键
  code: string // 登记证号
  name: string // 农资名称
  type: string // 农资类型
  size: string // 产品规格
  company: string // 采购公司
  price: string // 采购单价
  remark: string // 备注
  packageRelation: string // 包装关系
}

// 农资基础信息 API
export const AgriculturalBaseApi = {
  // 查询农资基础信息分页
  getAgriculturalBasePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/agricultural-base/page`, params })
  },

  // 查询农资基础信息详情
  getAgriculturalBase: async (id: number) => {
    return await request.get({ url: `/kaizhou/agricultural-base/get?id=` + id })
  },

  // 新增农资基础信息
  createAgriculturalBase: async (data: AgriculturalBaseVO) => {
    return await request.post({ url: `/kaizhou/agricultural-base/create`, data })
  },

  // 修改农资基础信息
  updateAgriculturalBase: async (data: AgriculturalBaseVO) => {
    return await request.put({ url: `/kaizhou/agricultural-base/update`, data })
  },

  // 删除农资基础信息
  deleteAgriculturalBase: async (id: number) => {
    return await request.delete({ url: `/kaizhou/agricultural-base/delete?id=` + id })
  },

  // 导出农资基础信息 Excel
  exportAgriculturalBase: async (params) => {
    return await request.download({ url: `/kaizhou/agricultural-base/export-excel`, params })
  },
}