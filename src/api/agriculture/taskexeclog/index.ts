import request from '@/config/axios'

// 任务执行记录 VO
export interface TaskExecLogVO {
  id: string // 主键id
  taskId: string // 任务id
  execTime: Date // 执行时间
  endTime: Date // 结束时间
  duration: string // 持续时长
  taskType: string // 任务类型
  type: string // 任务类型
  amountTimeNumber: number // 时间/量（分钟/L）
  iaCodeList: string // 任务执行灌区
}

// 任务执行记录 API
export const TaskExecLogApi = {
  // 查询任务执行记录分页
  getTaskExecLogPage: async (params: any) => {
    return await request.get({ url: `/agriculture/task-exec-log/page`, params })
  },

  // 查询任务执行记录详情
  getTaskExecLog: async (id: number) => {
    return await request.get({ url: `/agriculture/task-exec-log/get?id=` + id })
  },

  // 新增任务执行记录
  createTaskExecLog: async (data: TaskExecLogVO) => {
    return await request.post({ url: `/agriculture/task-exec-log/create`, data })
  },

  // 修改任务执行记录
  updateTaskExecLog: async (data: TaskExecLogVO) => {
    return await request.put({ url: `/agriculture/task-exec-log/update`, data })
  },

  // 删除任务执行记录
  deleteTaskExecLog: async (id: number) => {
    return await request.delete({ url: `/agriculture/task-exec-log/delete?id=` + id })
  },

  // 导出任务执行记录 Excel
  exportTaskExecLog: async (params) => {
    return await request.download({ url: `/agriculture/task-exec-log/export-excel`, params })
  }
}