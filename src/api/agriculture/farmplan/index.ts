import request from '@/config/axios'

// 农事计划 VO
export interface FarmPlanVO {
  id: string // 计划ID
  planCode: string // 计划编码
  planName: string // 计划名称
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
  planArea: string // 计划面积（亩）
  area: string // 土地面积（亩）
  farmDefineType:string
  planCode:string
  planName:string
  finishArea:string
  batchCode:string
  planDesc: string // 计划描述
}

// 农事计划 API
export const FarmPlanApi = {
  // 查询农事计划分页
  getFarmPlanPage: async (params: any) => {
    return await request.get({ url: `/agri/farm-plan/page`, params })
  },

  // 查询农事计划详情
  getFarmPlan: async (id: number) => {
    return await request.get({ url: `/agri/farm-plan/get?id=` + id })
  },

  // 新增农事计划
  createFarmPlan: async (data: FarmPlanVO) => {
    return await request.post({ url: `/agri/farm-plan/create`, data })
  },

  // 修改农事计划
  updateFarmPlan: async (data: FarmPlanVO) => {
    return await request.put({ url: `/agri/farm-plan/update`, data })
  },

  // 删除农事计划
  deleteFarmPlan: async (id: number) => {
    return await request.delete({ url: `/agri/farm-plan/delete?id=` + id })
  },

  // 导出农事计划 Excel
  exportFarmPlan: async (params) => {
    return await request.download({ url: `/agri/farm-plan/export-excel`, params })
  },
}
