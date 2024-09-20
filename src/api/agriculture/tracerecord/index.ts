import request from '@/config/axios'

// 溯源记录 VO
export interface TraceRecordVO {
  id: string // 主键
  traceCode: string // 溯源码
  productId: string // 产品id
  producerId: string // 生产商id
  reserveOne: string // 预留1
  reserveTwo: string // 预留2
  batchCode: string // 批次号
  traceTime: Date // 溯源时间
}

// 溯源记录 API
export const TraceRecordApi = {
  // 查询溯源记录分页
  getTraceRecordPage: async (params: any) => {
    return await request.get({ url: `/agriculture/trace-record/page`, params })
  },

  // 查询溯源记录详情
  getTraceRecord: async (id: number) => {
    return await request.get({ url: `/agriculture/trace-record/get?id=` + id })
  },

  // 新增溯源记录
  createTraceRecord: async (data: TraceRecordVO) => {
    return await request.post({ url: `/agriculture/trace-record/create`, data })
  },

  // 修改溯源记录
  updateTraceRecord: async (data: TraceRecordVO) => {
    return await request.put({ url: `/agriculture/trace-record/update`, data })
  },

  // 删除溯源记录
  deleteTraceRecord: async (id: number) => {
    return await request.delete({ url: `/agriculture/trace-record/delete?id=` + id })
  },

  // 导出溯源记录 Excel
  exportTraceRecord: async (params) => {
    return await request.download({ url: `/agriculture/trace-record/export-excel`, params })
  },
}
