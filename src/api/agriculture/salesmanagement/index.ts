import request from '@/config/axios'

// 销售管理 VO
export interface SalesManagementVO {
  id: string // 主键
  salesNum: string // 销售编号
  product: string // 产品
  unitPrice: string // 单价
  quantity: string // 数量
  totalPrice: string // 总价
  salesLocation: string // 销售地
  upTime: string // 时间
  remark: string // 备注
}

// 销售管理 API
export const SalesManagementApi = {
  // 查询销售管理分页
  getSalesManagementPage: async (params: any) => {
    return await request.get({ url: `/agriculture/sales-management/page`, params })
  },

  // 查询销售管理详情
  getSalesManagement: async (id: number) => {
    return await request.get({ url: `/agriculture/sales-management/get?id=` + id })
  },

  // 新增销售管理
  createSalesManagement: async (data: SalesManagementVO) => {
    return await request.post({ url: `/agriculture/sales-management/create`, data })
  },

  // 修改销售管理
  updateSalesManagement: async (data: SalesManagementVO) => {
    return await request.put({ url: `/agriculture/sales-management/update`, data })
  },

  // 删除销售管理
  deleteSalesManagement: async (id: number) => {
    return await request.delete({ url: `/agriculture/sales-management/delete?id=` + id })
  },

  // 导出销售管理 Excel
  exportSalesManagement: async (params) => {
    return await request.download({ url: `/agriculture/sales-management/export-excel`, params })
  },
}
