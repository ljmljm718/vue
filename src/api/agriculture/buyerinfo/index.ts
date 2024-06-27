import request from '@/config/axios'

// 买家管理详情 VO
export interface BuyerInfoVO {
  openId: string // 微信用户ID
  nickName: string // 用户昵称
  buyerImg: string // 用户头像
  buyerOne: string // 备用字段1
  buyerTwo: string // 备用字段2
  buyerThree: string // 备用字段3
  remark: string // 备注
}

// 买家管理详情 API
export const BuyerInfoApi = {
  // 查询买家管理详情分页
  getBuyerInfoPage: async (params: any) => {
    return await request.get({ url: `/app/buyer-info/page`, params })
  },

  // 查询买家管理详情详情
  getBuyerInfo: async (id: any) => {
    return await request.get({ url: `/app/buyer-info/get?openId=` + id })
  },

  // 新增买家管理详情
  createBuyerInfo: async (data: BuyerInfoVO) => {
    return await request.post({ url: `/app/buyer-info/create`, data })
  },

  // 修改买家管理详情
  updateBuyerInfo: async (data: BuyerInfoVO) => {
    return await request.put({ url: `/app/buyer-info/update`, data })
  },

  // 删除买家管理详情
  deleteBuyerInfo: async (id: any) => {
    return await request.delete({ url: `/app/buyer-info/delete?openId=` + id })
  },

  // 导出买家管理详情 Excel
  exportBuyerInfo: async (params) => {
    return await request.download({ url: `/app/buyer-info/export-excel`, params })
  }
}
