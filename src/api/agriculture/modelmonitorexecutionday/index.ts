import request from '@/config/axios'

// 监测执行日健康 VO
export interface ModelMonitorExecutionDayVO {
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
  monitorDate: Date // 检测日期
  growthId: string // 周期节点
  healthLevel: string // 健康等级
  indicatorResult: string // 指标结果
}

// 监测执行日健康 API
export const ModelMonitorExecutionDayApi = {
  // 查询监测执行日健康分页
  getModelMonitorExecutionDayPage: async (params: any) => {
    return await request.get({ url: `/agriculture/model-monitor-execution-day/page`, params })
  },

  // 查询监测执行日健康详情
  getModelMonitorExecutionDay: async (id: number) => {
    return await request.get({ url: `/agriculture/model-monitor-execution-day/get?id=` + id })
  },

  // 新增监测执行日健康
  createModelMonitorExecutionDay: async (data: ModelMonitorExecutionDayVO) => {
    return await request.post({ url: `/agriculture/model-monitor-execution-day/create`, data })
  },

  // 修改监测执行日健康
  updateModelMonitorExecutionDay: async (data: ModelMonitorExecutionDayVO) => {
    return await request.put({ url: `/agriculture/model-monitor-execution-day/update`, data })
  },

  // 删除监测执行日健康
  deleteModelMonitorExecutionDay: async (id: number) => {
    return await request.delete({ url: `/agriculture/model-monitor-execution-day/delete?id=` + id })
  },

  // 导出监测执行日健康 Excel
  exportModelMonitorExecutionDay: async (params) => {
    return await request.download({ url: `/agriculture/model-monitor-execution-day/export-excel`, params })
  },
}
