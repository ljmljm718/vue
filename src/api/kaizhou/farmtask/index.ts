import request from '@/config/axios'

// 农事任务 VO
export interface FarmTaskVO {
  id: string // 主键
  taskCode: string // 任务编码
  taskPerson: string // 任务人员
  taskDemand: string // 任务完成要求
  taskStartdate: Date // 任务开始时间
  taskEnddate: Date // 任务截止时间
  taskStastus: string // 任务状态
  taskName: string // 任务名称
  plotId: number // 地块id
  plotName: string // 地块名称
  checkStandard: string // 验收标准
}

// 农事任务 API
export const FarmTaskApi = {
  // 查询农事任务分页
  getFarmTaskPage: async (params: any) => {
    return await request.get({ url: `/kaizhou/farm-task/page`, params })
  },

  // 查询农事任务详情
  getFarmTask: async (id: number) => {
    return await request.get({ url: `/kaizhou/farm-task/get?id=` + id })
  },

  // 新增农事任务
  createFarmTask: async (data: FarmTaskVO) => {
    return await request.post({ url: `/kaizhou/farm-task/create`, data })
  },

  // 修改农事任务
  updateFarmTask: async (data: FarmTaskVO) => {
    return await request.put({ url: `/kaizhou/farm-task/update`, data })
  },

  // 删除农事任务
  deleteFarmTask: async (id: number) => {
    return await request.delete({ url: `/kaizhou/farm-task/delete?id=` + id })
  },

  // 导出农事任务 Excel
  exportFarmTask: async (params) => {
    return await request.download({ url: `/kaizhou/farm-task/export-excel`, params })
  },
  publishFarmTask: async (id:number)=>{
    return await request.get({ url: `/kaizhou/farm-task/publish?id=` + id })
  }
}
