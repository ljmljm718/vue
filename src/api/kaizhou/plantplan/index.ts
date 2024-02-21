import request from '@/config/axios'

// 种植计划 VO
export interface PlantPlanVO {
  id: string // 主键
  parkId: string // 园区id
  parkName: string // 园区名称
  plotId: string // 地块id
  plotName: string // 地块名称
  plantVariety: string // 种植作物品种名称
  plantCategory: string // 类别
  plantStatus: string // 状态
  area: string // 面积
  plantPerson: string // 负责人
  plantStarttime: Date // 种植开始时间
  plantEndtime: Date // 种植结束时间
  cropId: string // 作物id
  plantCode: string // 计划编码
}

// 种植计划 API
export const PlantPlanApi = {
  // 查询种植计划分页
  getPlantPlanPage: async (params: any) => {
    return await request.get({ url: `/kaizhou/plant-plan/page`, params })
  },

  // 查询种植计划详情
  getPlantPlan: async (id: number) => {
    return await request.get({ url: `/kaizhou/plant-plan/get?id=` + id })
  },

  // 新增种植计划
  createPlantPlan: async (data: PlantPlanVO) => {
    return await request.post({ url: `/kaizhou/plant-plan/create`, data })
  },

  // 修改种植计划
  updatePlantPlan: async (data: PlantPlanVO) => {
    return await request.put({ url: `/kaizhou/plant-plan/update`, data })
  },

  // 删除种植计划
  deletePlantPlan: async (id: number) => {
    return await request.delete({ url: `/kaizhou/plant-plan/delete?id=` + id })
  },

  // 导出种植计划 Excel
  exportPlantPlan: async (params) => {
    return await request.download({ url: `/kaizhou/plant-plan/export-excel`, params })
  },
}
