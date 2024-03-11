import request from '@/config/axios'

// 农资库存管理 VO
export interface InventoryManagementVO {
  id: string // 主键
  agriculturalMaterialName: string // 农资名称
  wushanSpecification: string // 规格
  stockQuantity: string // 库存数量
  productionDate: Date // 生产日期
  expiryDate: Date // 有效日期
  outboundDetails: string // 出库详情
  wushanRemarks: string // 备注
  reserveOne: string // 备用一
  reserveTwo: string // 备用二
  reserveThree: string // 备用三
}

// 农资库存管理 API
export const InventoryManagementApi = {
  // 查询农资库存管理分页
  getInventoryManagementPage: async (params: any) => {
    return await request.get({ url: `/wushan/inventory-management/page`, params })
  },

  // 查询农资库存管理详情
  getInventoryManagement: async (id: number) => {
    return await request.get({ url: `/wushan/inventory-management/get?id=` + id })
  },

  // 新增农资库存管理
  createInventoryManagement: async (data: InventoryManagementVO) => {
    return await request.post({ url: `/wushan/inventory-management/create`, data })
  },

  // 修改农资库存管理
  updateInventoryManagement: async (data: InventoryManagementVO) => {
    return await request.put({ url: `/wushan/inventory-management/update`, data })
  },

  // 删除农资库存管理
  deleteInventoryManagement: async (id: number) => {
    return await request.delete({ url: `/wushan/inventory-management/delete?id=` + id })
  },

  // 导出农资库存管理 Excel
  exportInventoryManagement: async (params) => {
    return await request.download({ url: `/wushan/inventory-management/export-excel`, params })
  },
}