import request from '@/config/axios'

// 库存预警配置 VO
export interface StockWarnVO {
  id: number // 主键
  productId: number // 库存编号
  threshold: number // 阈值
  purchaseNum: number // 采购数量
  warnStatus: string // 状态
}

// 库存预警配置 API
export const StockWarnApi = {
  // 查询库存预警配置分页
  getStockWarnPage: async (params: any) => {
    return await request.get({ url: `/agriculture/stock-warn/page`, params })
  },

  // 查询库存预警配置详情
  getStockWarn: async (id: number) => {
    return await request.get({ url: `/agriculture/stock-warn/get?id=` + id })
  },

  // 新增库存预警配置
  createStockWarn: async (data: StockWarnVO) => {
    return await request.post({ url: `/agriculture/stock-warn/create`, data })
  },

  // 修改库存预警配置
  updateStockWarn: async (data: StockWarnVO) => {
    return await request.put({ url: `/agriculture/stock-warn/update`, data })
  },

  // 删除库存预警配置
  deleteStockWarn: async (id: number) => {
    return await request.delete({ url: `/agriculture/stock-warn/delete?id=` + id })
  },

  // 导出库存预警配置 Excel
  exportStockWarn: async (params) => {
    return await request.download({ url: `/agriculture/stock-warn/export-excel`, params })
  },
}