import request from '@/config/axios'

// 稻米产品溯源管理 VO
export interface ProductTracingVO {
  id: string // 主键
  productCode: string // 产品码
  firmName: string // 企业名称
  sourceArea: string // 原产地
  yieldTime: Date // 生产时间
  productApprove: string // 产品认证
  remark: string // 备注
  receiptStartTime: Date // 开始时间
  receiptEndTime: Date // 结束时间
  batchCode: string // 批次号
  batchQrImg: byte[] // 批次二维码
}

// 稻米产品溯源管理 API
export const ProductTracingApi = {
  // 查询稻米产品溯源管理分页
  getProductTracingPage: async (params: any) => {
    return await request.get({ url: `/agri/product-tracing/page`, params })
  },

  // 查询稻米产品溯源管理详情
  getProductTracing: async (id: number) => {
    return await request.get({ url: `/agri/product-tracing/get?id=` + id })
  },

  // 新增稻米产品溯源管理
  createProductTracing: async (data: ProductTracingVO) => {
    return await request.post({ url: `/agri/product-tracing/create`, data })
  },

  // 修改稻米产品溯源管理
  updateProductTracing: async (data: ProductTracingVO) => {
    return await request.put({ url: `/agri/product-tracing/update`, data })
  },

  // 删除稻米产品溯源管理
  deleteProductTracing: async (id: number) => {
    return await request.delete({ url: `/agri/product-tracing/delete?id=` + id })
  },

  // 导出稻米产品溯源管理 Excel
  exportProductTracing: async (params) => {
    return await request.download({ url: `/agri/product-tracing/export-excel`, params })
  }
}