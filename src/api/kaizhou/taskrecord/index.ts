import request from '@/config/axios'

// 任务记录 VO
export interface TaskRecordVO {
  id: string // 主键
  taskId: string // 关联任务
  startTime: Date // 开始时间
  endTime: Date // 完成时间
  auditStatus: string // 审核状态
  auditOpinion: string // 审核意见
  auditPerson: string // 审核人员
  taskPerson: string // 任务人员
}

// 任务记录 API
export const TaskRecordApi = {
  // 查询任务记录分页
  getTaskRecordPage: async (params: any) => {
    return await request.get({ url: `/kaizhou/task-record/page`, params })
  },

  // 查询任务记录详情
  getTaskRecord: async (id: number) => {
    return await request.get({ url: `/kaizhou/task-record/get?id=` + id })
  },

  // 新增任务记录
  createTaskRecord: async (data: TaskRecordVO) => {
    return await request.post({ url: `/kaizhou/task-record/create`, data })
  },

  // 修改任务记录
  updateTaskRecord: async (data: TaskRecordVO) => {
    return await request.put({ url: `/kaizhou/task-record/update`, data })
  },

  // 删除任务记录
  deleteTaskRecord: async (id: number) => {
    return await request.delete({ url: `/kaizhou/task-record/delete?id=` + id })
  },

  // 导出任务记录 Excel
  exportTaskRecord: async (params) => {
    return await request.download({ url: `/kaizhou/task-record/export-excel`, params })
  },
}