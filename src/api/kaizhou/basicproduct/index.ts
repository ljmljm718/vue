import request from '@/config/axios'

// 产品管理 VO
export interface BasicProductVO {
  id: string // id
  productCode: string // 产品编号
  productName: string // 产品名称
  productKind: string // 产品种类
  productDescribe: string // 产品描述
  identificationCode: string // 标识码
  approveStatus: string // 认证状态
  approveTime: Date // 认证时间
}

// 产品管理 API
export const BasicProductApi = {
  // 查询产品管理分页
  getBasicProductPage: async (params: any) => {
    return await request.get({ url: `/kaizhou/basic-product/page`, params })
  },

  // 查询产品管理详情
  getBasicProduct: async (id: number) => {
    return await request.get({ url: `/kaizhou/basic-product/get?id=` + id })
  },

  // 新增产品管理
  createBasicProduct: async (data: BasicProductVO) => {
    return await request.post({ url: `/kaizhou/basic-product/create`, data })
  },

  // 修改产品管理
  updateBasicProduct: async (data: BasicProductVO) => {
    return await request.put({ url: `/kaizhou/basic-product/update`, data })
  },

  // 删除产品管理
  deleteBasicProduct: async (id: number) => {
    return await request.delete({ url: `/kaizhou/basic-product/delete?id=` + id })
  },

  // 导出产品管理 Excel
  exportBasicProduct: async (params) => {
    return await request.download({ url: `/kaizhou/basic-product/export-excel`, params })
  },
}
