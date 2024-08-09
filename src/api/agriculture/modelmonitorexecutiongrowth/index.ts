import request from '@/config/axios'

// 监测执行周期 VO
export interface ModelMonitorExecutionGrowthVO {
  id: string // 主键
  belongParkId: string // 所属基地id
  belongPlotId: string // 所属地块id
  belongCategoryId: string // 所属品类id
  belongVarietyId: string // 所属品种id
  batch: string // 批次
  indicator: string // 指标
  indicatorWeight: string // 指标权重
  element: string // 要素
  elementWeight: string // 要素权重
  elementValue: string // 要素值
  elementUnits: string // 要素单位
  elementScore: string // 要素得分
  growthId: string // 周期节点
  healthLevel: string // 健康等级
  indicatorResult: string // 指标结果
}

// 监测执行周期 API
export const ModelMonitorExecutionGrowthApi = {
  // 查询监测执行周期分页
  getModelMonitorExecutionGrowthPage: async (params: any) => {
    return await request.get({ url: `/agriculture/model-monitor-execution-growth/page`, params })
  },

  // 查询监测执行周期详情
  getModelMonitorExecutionGrowth: async (id: number) => {
    return await request.get({ url: `/agriculture/model-monitor-execution-growth/get?id=` + id })
  },

  // 新增监测执行周期
  createModelMonitorExecutionGrowth: async (data: ModelMonitorExecutionGrowthVO) => {
    return await request.post({ url: `/agriculture/model-monitor-execution-growth/create`, data })
  },

  // 修改监测执行周期
  updateModelMonitorExecutionGrowth: async (data: ModelMonitorExecutionGrowthVO) => {
    return await request.put({ url: `/agriculture/model-monitor-execution-growth/update`, data })
  },

  // 删除监测执行周期
  deleteModelMonitorExecutionGrowth: async (id: number) => {
    return await request.delete({ url: `/agriculture/model-monitor-execution-growth/delete?id=` + id })
  },

  // 导出监测执行周期 Excel
  exportModelMonitorExecutionGrowth: async (params) => {
    return await request.download({ url: `/agriculture/model-monitor-execution-growth/export-excel`, params })
  },
}
