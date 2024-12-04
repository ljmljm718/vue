import request from '@/config/axios'

// 施肥任务明细 VO
export interface TaskFertilizationDetailVO {
  id: string // 主键id
  tfId: string // 所属任务id
  chargingBasketName: string,//料桶名
  upperWaterValveId: string // 上水阀id
  upperWaterYield: number // 上水量
  fertilizerMixerId: string // 混肥器id
  fertilizerMixerStatus: string // 混肥器状态
  measureBucketStatus: string // 定量桶状态
}

// 施肥任务明细 API
export const TaskFertilizationDetailApi = {
  // 查询施肥任务明细分页
  getTaskFertilizationDetailPage: async (params: any) => {
    return await request.get({ url: `/agriculture/task-fertilization-detail/page`, params })
  },

  // 查询施肥任务明细详情
  getTaskFertilizationDetail: async (id: number) => {
    return await request.get({ url: `/agriculture/task-fertilization-detail/get?id=` + id })
  },

  // 新增施肥任务明细
  createTaskFertilizationDetail: async (data: TaskFertilizationDetailVO) => {
    return await request.post({ url: `/agriculture/task-fertilization-detail/create`, data })
  },

  // 修改施肥任务明细
  updateTaskFertilizationDetail: async (data: TaskFertilizationDetailVO) => {
    return await request.put({ url: `/agriculture/task-fertilization-detail/update`, data })
  },

  // 删除施肥任务明细
  deleteTaskFertilizationDetail: async (id: number) => {
    return await request.delete({ url: `/agriculture/task-fertilization-detail/delete?id=` + id })
  },

  // 导出施肥任务明细 Excel
  exportTaskFertilizationDetail: async (params) => {
    return await request.download({ url: `/agriculture/task-fertilization-detail/export-excel`, params })
  }
}