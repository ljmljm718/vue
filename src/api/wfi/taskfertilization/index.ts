import request from '@/config/axios'

// 施肥任务 VO
export interface TaskFertilizationVO {
  id: string // 主键id
  tfName: string // 任务名称
  belongWfiSystem: string // 所属系统
  fertilizationType: string // 施肥类型
  mixingType: string // 搅拌类型
  waterPumpStatus: string // 水泵控制
  concurrentTaskNumber: number // 并发任务执行数量
  amountTimeNumber: number // 施肥时长/量（分钟/L）
  iaCodeList: string // 任务执行灌区
  status: string // 状态
}

// 施肥任务 API
export const TaskFertilizationApi = {
  // 查询施肥任务分页
  getTaskFertilizationPage: async (params: any) => {
    return await request.get({ url: `/wfi/task-fertilization/page`, params })
  },

  // 查询施肥任务详情
  getTaskFertilization: async (id: number) => {
    return await request.get({ url: `/wfi/task-fertilization/get?id=` + id })
  },

  // 新增施肥任务
  createTaskFertilization: async (data: TaskFertilizationVO) => {
    return await request.post({ url: `/wfi/task-fertilization/create`, data })
  },

  // 修改施肥任务
  updateTaskFertilization: async (data: TaskFertilizationVO) => {
    return await request.put({ url: `/wfi/task-fertilization/update`, data })
  },

  // 删除施肥任务
  deleteTaskFertilization: async (id: number) => {
    return await request.delete({ url: `/wfi/task-fertilization/delete?id=` + id })
  },

  // 导出施肥任务 Excel
  exportTaskFertilization: async (params) => {
    return await request.download({ url: `/wfi/task-fertilization/export-excel`, params })
  }
}