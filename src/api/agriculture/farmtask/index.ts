import request from '@/config/axios'

// 农事任务 VO
export interface FarmTaskVO {
  id: number // 计划ID
  belongPark: string // 所属基地
  parkName: string // 基地名称
  belongPlot: string // 所属地块
  plotName: string // 地块名称
  processInstanceId: string // 实例编号
  status: number // 审批结果
  startTime: Date // 开始时间
  endTime: Date // 完成时间
  completeRequirement: string // 完成要求
  acceptanceStandard: string // 验收标准
}

// 农事任务 API
export const FarmTaskApi = {
  // 查询农事任务分页
  getFarmTaskPage: async (params: any) => {
    return await request.get({ url: `/agriculture/farm-task/page`, params })
  },

  // 查询农事任务详情
  getFarmTask: async (id: number) => {
    return await request.get({ url: `/agriculture/farm-task/get?id=` + id })
  },

  // 新增农事任务
  createFarmTask: async (data: FarmTaskVO) => {
    return await request.post({ url: `/agriculture/farm-task/create`, data })
  },

  // 修改农事任务
  updateFarmTask: async (data: FarmTaskVO) => {
    return await request.put({ url: `/agriculture/farm-task/update`, data })
  },

  // 删除农事任务
  deleteFarmTask: async (id: number) => {
    return await request.delete({ url: `/agriculture/farm-task/delete?id=` + id })
  },

  // 导出农事任务 Excel
  exportFarmTask: async (params) => {
    return await request.download({ url: `/agriculture/farm-task/export-excel`, params })
  },
}