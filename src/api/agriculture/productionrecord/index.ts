import request from '@/config/axios'

// 生产记录 VO
export interface ProductionRecordVO {
  id: number // id
  lineNo: string // 产线编号
  lineName: string // 产线名称
  outOrderId: number // 出库单id
  rawName: string // 原材料
  rawNumber: string // 原材料数量
  rawUnit: string // 单位
  productBatch: string // 产品批次
  productName: string // 产品名称
  totalNumber: string // 产出总数量
  qualifiedNumber: string // 合格数量
  productUnit: string // 单位
  handleStartTime: Date // 开始处理时间
  handleEndTime: Date // 结束处理时间
  lineStatus: string // 状态
  warehouseId: number
  warehouseName: string
  productId: number
  supplierId: number
}

// 生产记录 API
export const ProductionRecordApi = {
  // 查询生产记录分页
  getProductionRecordPage: async (params: any) => {
    return await request.get({ url: `/agriculture/production-record/page`, params })
  },

  // 查询生产记录详情
  getProductionRecord: async (id: number) => {
    return await request.get({ url: `/agriculture/production-record/get?id=` + id })
  },

  // 新增生产记录
  createProductionRecord: async (data: ProductionRecordVO) => {
    return await request.post({ url: `/agriculture/production-record/create`, data })
  },

  // 修改生产记录
  updateProductionRecord: async (data: ProductionRecordVO) => {
    return await request.put({ url: `/agriculture/production-record/update`, data })
  },

  // 删除生产记录
  deleteProductionRecord: async (id: number) => {
    return await request.delete({ url: `/agriculture/production-record/delete?id=` + id })
  },

  // 导出生产记录 Excel
  exportProductionRecord: async (params) => {
    return await request.download({ url: `/agriculture/production-record/export-excel`, params })
  },
}
