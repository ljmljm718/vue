import request from '@/config/axios'

// 标识管理 VO
export interface BasicIdentificationVO {
  id: string // id
  identificationCode: string // 标识码
  qrCode: string // 二维码
  uniqueCodeTime: Date // 赋码时间
  isBinding: string // 是否绑定
  isUniqueCode: string // 是否赋码
}

// 标识管理 API
export const BasicIdentificationApi = {
  // 查询标识管理分页
  getBasicIdentificationPage: async (params: any) => {
    return await request.get({ url: `/kaizhou/basic-identification/page`, params })
  },

  // 查询标识管理详情
  getBasicIdentification: async (id: number) => {
    return await request.get({ url: `/kaizhou/basic-identification/get?id=` + id })
  },

  // 新增标识管理
  createBasicIdentification: async (data: BasicIdentificationVO) => {
    return await request.post({ url: `/kaizhou/basic-identification/create`, data })
  },

  // 修改标识管理
  updateBasicIdentification: async (data: BasicIdentificationVO) => {
    return await request.put({ url: `/kaizhou/basic-identification/update`, data })
  },

  // 删除标识管理
  deleteBasicIdentification: async (id: number) => {
    return await request.delete({ url: `/kaizhou/basic-identification/delete?id=` + id })
  },

  // 导出标识管理 Excel
  exportBasicIdentification: async (params) => {
    return await request.download({ url: `/kaizhou/basic-identification/export-excel`, params })
  },

  // 赋码
  uniqueCodeIdentification: async (data: BasicIdentificationVO) => {
    return await request.put({url: `/kaizhou/basic-identification/uniqueCode`, data})
  },
}
