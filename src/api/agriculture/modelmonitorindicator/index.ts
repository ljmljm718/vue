import request from '@/config/axios'

// 监测指标 VO
export interface ModelMonitorIndicatorVO {
  id: string // 主键（指标编号）
  modelId: string // 模型id
  growthPeriodId: string // 生长周期id
  indicatorName: string // 指标名称
  indicatorDescription: string // 指标描述
  indicatorRange: string // 指标范围
  indicatorResult: string // 指标结果
  healthScore: string // 健康分值
  weight: string // 权重
  isDefault: boolean // 是否默认
  implementationClass: string // 实现类
}

// 监测指标 API
export const ModelMonitorIndicatorApi = {
  // 查询监测指标分页
  getModelMonitorIndicatorPage: async (params: any) => {
    return await request.get({ url: `/agriculture/model-monitor-indicator/page`, params })
  },

  // 查询监测指标详情
  getModelMonitorIndicator: async (id: number) => {
    return await request.get({ url: `/agriculture/model-monitor-indicator/get?id=` + id })
  },

  // 新增监测指标
  createModelMonitorIndicator: async (data: ModelMonitorIndicatorVO) => {
    return await request.post({ url: `/agriculture/model-monitor-indicator/create`, data })
  },

  // 修改监测指标
  updateModelMonitorIndicator: async (data: ModelMonitorIndicatorVO) => {
    return await request.put({ url: `/agriculture/model-monitor-indicator/update`, data })
  },

  // 删除监测指标
  deleteModelMonitorIndicator: async (id: number) => {
    return await request.delete({ url: `/agriculture/model-monitor-indicator/delete?id=` + id })
  },

  // 导出监测指标 Excel
  exportModelMonitorIndicator: async (params) => {
    return await request.download({ url: `/agriculture/model-monitor-indicator/export-excel`, params })
  },

  // 根据品种id获取生长周期
  getGrowthByVarietyId: async (params) => {
    return await request.download({ url: `/agriculture/model-management/getGrowthByVarietyId`, params })
  },
  
}
