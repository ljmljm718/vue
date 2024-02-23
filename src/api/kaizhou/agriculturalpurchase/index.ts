import request from '@/config/axios'

// 农资采购信息 VO
export interface AgriculturalPurchaseVO {
  id: number // 主键
  agriculturalId: string // 农资主键
  agriculturalName: string // 农资名称
  agriculturalSize: string // 农资规格
  purchaseId: string // 采购单号
  purchaseTime: Date // 采购日期
  supplierName: string // 供应商
  purchasePrice: string // 采购单价
  purchaseNum: string // 采购数量
  totalPrice: string // 采购金额
  orderStatus: string // 订单状态
  productionDate: Date // 生产日期
  expirationDate: Date // 有效日期
  remark: string // 备注
}

// 农资采购信息 API
export const AgriculturalPurchaseApi = {
  // 查询农资采购信息分页
  getAgriculturalPurchasePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/agricultural-purchase/page`, params })
  },

  // 查询农资采购信息详情
  getAgriculturalPurchase: async (id: number) => {
    return await request.get({ url: `/kaizhou/agricultural-purchase/get?id=` + id })
  },

  // 新增农资采购信息
  createAgriculturalPurchase: async (data: AgriculturalPurchaseVO) => {
    return await request.post({ url: `/kaizhou/agricultural-purchase/create`, data })
  },

  // 修改农资采购信息
  updateAgriculturalPurchase: async (data: AgriculturalPurchaseVO) => {
    return await request.put({ url: `/kaizhou/agricultural-purchase/update`, data })
  },

  // 删除农资采购信息
  deleteAgriculturalPurchase: async (id: number) => {
    return await request.delete({ url: `/kaizhou/agricultural-purchase/delete?id=` + id })
  },

  // 导出农资采购信息 Excel
  exportAgriculturalPurchase: async (params) => {
    return await request.download({ url: `/kaizhou/agricultural-purchase/export-excel`, params })
  },
}
