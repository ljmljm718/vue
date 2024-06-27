import request from '@/config/axios'

// 地址信息记录 VO
export interface AddressInfoRecordVO {
  id: string // 主键id
  addressNumber: string // 地址标识号
  contact: string // 联系人
  phoneNumber: string // 手机号码
  areaInfo: string // 地区信息
  fullAddress: string // 详细地址
  zipCode: string // 邮政编码
  isDefault: string // 是否默认
  remark: string // 备注
}

// 地址信息记录 API
export const AddressInfoRecordApi = {
  // 查询地址信息记录分页
  getAddressInfoRecordPage: async (params: any) => {
    return await request.get({ url: `/agriculture/address-info-record/page`, params })
  },

  // 查询地址信息记录详情
  getAddressInfoRecord: async (id: number) => {
    return await request.get({ url: `/agriculture/address-info-record/get?id=` + id })
  },

  // 新增地址信息记录
  createAddressInfoRecord: async (data: AddressInfoRecordVO) => {
    return await request.post({ url: `/agriculture/address-info-record/create`, data })
  },

  // 修改地址信息记录
  updateAddressInfoRecord: async (data: AddressInfoRecordVO) => {
    return await request.put({ url: `/agriculture/address-info-record/update`, data })
  },

  // 删除地址信息记录
  deleteAddressInfoRecord: async (id: number) => {
    return await request.delete({ url: `/agriculture/address-info-record/delete?id=` + id })
  },

  // 导出地址信息记录 Excel
  exportAddressInfoRecord: async (params) => {
    return await request.download({ url: `/agriculture/address-info-record/export-excel`, params })
  },
}
