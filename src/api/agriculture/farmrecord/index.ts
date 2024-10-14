import request from '@/config/axios'

// 农事记录 VO
export interface FarmRecordVO {
  id: string // 计划ID
  planId: string // 农事计划id
  planName: string // 农事计划名称
  belongPark: string // 所属基地
  parkName: string // 基地名称
  belongPlot: string // 所属地块
  plotName: string // 地块名称
  cropId: string // 作物id
  cropName: string // 作物名称
  cropType: string // 品种
  planState: string // 计划状态
  personId: number // 责任人编号
  personName: string // 责任人
  startTime: Date // 计划开始时间
  endTime: Date // 计划结束时间
  recordTime: Date // 记录时间
  planArea: string // 计划面积（亩）
  recordArea: string // 土地面积（亩）
  recordState: string // 记录状态
  farmDefineType:string
  batchCode:string
  recordImg: string // 记录图片
}

// 农事记录 API
export const FarmRecordApi = {
  // 查询农事记录分页
  getFarmRecordPage: async (params: any) => {
    return await request.get({ url: `/agri/farm-record/page`, params })
  },

  // 查询农事记录详情
  getFarmRecord: async (id: number) => {
    return await request.get({ url: `/agri/farm-record/get?id=` + id })
  },

  // 新增农事记录
  createFarmRecord: async (data: FarmRecordVO) => {
    return await request.post({ url: `/agri/farm-record/create`, data })
  },

  // 修改农事记录
  updateFarmRecord: async (data: FarmRecordVO) => {
    return await request.put({ url: `/agri/farm-record/update`, data })
  },

  // 删除农事记录
  deleteFarmRecord: async (id: number) => {
    return await request.delete({ url: `/agri/farm-record/delete?id=` + id })
  },

  // 导出农事记录 Excel
  exportFarmRecord: async (params) => {
    return await request.download({ url: `/agri/farm-record/export-excel`, params })
  },
}
