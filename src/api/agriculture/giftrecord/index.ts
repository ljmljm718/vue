import request from '@/config/axios'

// 赠送记录 VO
export interface GiftRecordVO {
  id: string // 主键id
  planNumber: string // 计划流水号
  recordNumber: string // 赠送记录流水号
  presenterId: string // 赠送方用户
  dealTime: Date // 赠送时间
  oldOrderNumber: string // 原始订单流水号
  status: string // 领取状态
  remark: string // 备注
  recipientId: string // 接收方用户
  receptionTime: Date // 接收时间
  newOrderNumber: string // 新订单流水号
}

// 赠送记录 API
export const GiftRecordApi = {
  // 查询赠送记录分页
  getGiftRecordPage: async (params: any) => {
    return await request.get({ url: `/agriculture/gift-record/page`, params })
  },

  // 查询赠送记录详情
  getGiftRecord: async (id: number) => {
    return await request.get({ url: `/agriculture/gift-record/get?id=` + id })
  },

  // 新增赠送记录
  createGiftRecord: async (data: GiftRecordVO) => {
    return await request.post({ url: `/agriculture/gift-record/create`, data })
  },

  // 修改赠送记录
  updateGiftRecord: async (data: GiftRecordVO) => {
    return await request.put({ url: `/agriculture/gift-record/update`, data })
  },

  // 删除赠送记录
  deleteGiftRecord: async (id: number) => {
    return await request.delete({ url: `/agriculture/gift-record/delete?id=` + id })
  },

  // 导出赠送记录 Excel
  exportGiftRecord: async (params) => {
    return await request.download({ url: `/agriculture/gift-record/export-excel`, params })
  }
}
