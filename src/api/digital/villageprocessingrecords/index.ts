import request from '@/config/axios'

// 加工记录 VO
export interface VillageProcessingRecordsVO {
  id: string // 主键
  recoveryNum: string // 采收编号
  machiningTime: string // 加工时间
  product: string // 品种名称
  batchCode: string // 批次号
  remark: string // 消耗量
}

// 加工记录 API
export const VillageProcessingRecordsApi = {
  // 查询加工记录分页
  getVillageProcessingRecordsPage: async (params: any) => {
    return await request.get({ url: `/digital/village-processing-records/page`, params })
  },

  // 查询加工记录详情
  getVillageProcessingRecords: async (id: number) => {
    return await request.get({ url: `/digital/village-processing-records/get?id=` + id })
  },

  // 新增加工记录
  createVillageProcessingRecords: async (data: VillageProcessingRecordsVO) => {
    return await request.post({ url: `/digital/village-processing-records/create`, data })
  },

  // 修改加工记录
  updateVillageProcessingRecords: async (data: VillageProcessingRecordsVO) => {
    return await request.put({ url: `/digital/village-processing-records/update`, data })
  },

  // 删除加工记录
  deleteVillageProcessingRecords: async (id: number) => {
    return await request.delete({ url: `/digital/village-processing-records/delete?id=` + id })
  },

  // 导出加工记录 Excel
  exportVillageProcessingRecords: async (params) => {
    return await request.download({ url: `/digital/village-processing-records/export-excel`, params })
  },
}
