import request from '@/config/axios'

// 认养订单 VO
export interface AdoptionOrderVO {
  id: string // 主键id
  serialNumber: string // 计划流水号
  orderNumber: string // 订单流水号
  parkId: string // 基地编号
  plotId: string // 地块编号
  orderType: string // 订单类型
  addressNumber: string // 地址标识号
  orderAmount: number // 订单金额
  realAmount: number // 实付金额
  paymentTime: Date // 付款时间
  shippingTime: Date // 发货时间
  receiptTime: Date // 收货时间
  status: string // 状态
  isPresented: string // 订单赠送标识
  isRemind: string // 是否提醒
  expectStart: Date // 预计收货日期（起）
  expectEnd: Date // 预计收货日期（止）
  remark: string // 备注
}

// 认养订单 API
export const AdoptionOrderApi = {
  // 查询认养订单分页
  getAdoptionOrderPage: async (params: any) => {
    return await request.get({ url: `/agriculture/adoption-order/page`, params })
  },

  // 查询认养订单详情
  getAdoptionOrder: async (id: number) => {
    return await request.get({ url: `/agriculture/adoption-order/get?id=` + id })
  },

  // 新增认养订单
  createAdoptionOrder: async (data: AdoptionOrderVO) => {
    return await request.post({ url: `/agriculture/adoption-order/create`, data })
  },

  // 修改认养订单
  updateAdoptionOrder: async (data: AdoptionOrderVO) => {
    return await request.put({ url: `/agriculture/adoption-order/update`, data })
  },

  // 删除认养订单
  deleteAdoptionOrder: async (id: number) => {
    return await request.delete({ url: `/agriculture/adoption-order/delete?id=` + id })
  },

  // 导出认养订单 Excel
  exportAdoptionOrder: async (params) => {
    return await request.download({ url: `/agriculture/adoption-order/export-excel`, params })
  }
}