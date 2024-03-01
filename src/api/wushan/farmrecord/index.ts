import request from '@/config/axios'

// 巫山农事记录 VO
export interface FarmRecordVO {
  id: string // 编码
  statisticalTime: string // 统计时间
  agriculturalRecordCode: string // 农事记录编码
  output: string // 产量(KG)
  unitPrice: string // 单价(元)
  income: string // 收入(元)
  reserveOne: string // 备用一
  reserveTwo: string // 备用二
  reserveThree: string // 备用三
}

// 巫山农事记录 API
export const FarmRecordApi = {
  // 查询巫山农事记录分页
  getFarmRecordPage: async (params: any) => {
    return await request.get({ url: `/wushan/farm-record/page`, params })
  },

  // 查询巫山农事记录详情
  getFarmRecord: async (id: number) => {
    return await request.get({ url: `/wushan/farm-record/get?id=` + id })
  },

  // 新增巫山农事记录
  createFarmRecord: async (data: FarmRecordVO) => {
    return await request.post({ url: `/wushan/farm-record/create`, data })
  },

  // 修改巫山农事记录
  updateFarmRecord: async (data: FarmRecordVO) => {
    return await request.put({ url: `/wushan/farm-record/update`, data })
  },

  // 删除巫山农事记录
  deleteFarmRecord: async (id: number) => {
    return await request.delete({ url: `/wushan/farm-record/delete?id=` + id })
  },

  // 导出巫山农事记录 Excel
  exportFarmRecord: async (params) => {
    return await request.download({ url: `/wushan/farm-record/export-excel`, params })
  },
}