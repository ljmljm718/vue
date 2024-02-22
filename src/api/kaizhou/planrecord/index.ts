import request from '@/config/axios'

// 农事记录 VO
export interface PlanRecordVO {
  id: string // 主键
  plantId: string // 种植计划id
  recodeCode: string // 计划编码
  farmWork: string // 农事定义
  remark: string // 描述
  recordTime: Date // 记录时间
  recordValue: string // 数值
  recordUnit: string // 单位
}

// 农事记录 API
export const PlanRecordApi = {
  // 查询农事记录分页
  getPlanRecordPage: async (params: any) => {
    return await request.get({ url: `/kaizhou/plan-record/page`, params })
  },

  // 查询农事记录详情
  getPlanRecord: async (id: number) => {
    return await request.get({ url: `/kaizhou/plan-record/get?id=` + id })
  },

  // 新增农事记录
  createPlanRecord: async (data: PlanRecordVO) => {
    return await request.post({ url: `/kaizhou/plan-record/create`, data })
  },

  // 修改农事记录
  updatePlanRecord: async (data: PlanRecordVO) => {
    return await request.put({ url: `/kaizhou/plan-record/update`, data })
  },

  // 删除农事记录
  deletePlanRecord: async (id: number) => {
    return await request.delete({ url: `/kaizhou/plan-record/delete?id=` + id })
  },

  // 导出农事记录 Excel
  exportPlanRecord: async (params) => {
    return await request.download({ url: `/kaizhou/plan-record/export-excel`, params })
  },
}
