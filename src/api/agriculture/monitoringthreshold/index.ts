import request from '@/config/axios'

// 监测阈值 VO
export interface MonitoringThresholdVO {
  id: string // id
  name: string // 名称
  growthPeriod: string // 生长期
  collectionType: string // 采集类型
  monitoringType: string // 监测类型
  suitableEnvironmentMin: string // 适宜温度最小值
  suitableEnvironmentMax: string // 适宜环境最大值
}

// 监测阈值 API
export const MonitoringThresholdApi = {
  // 查询监测阈值分页
  getMonitoringThresholdPage: async (params: any) => {
    return await request.get({ url: `/agriculture/monitoring-threshold/page`, params })
  },

  // 查询监测阈值详情
  getMonitoringThreshold: async (id: number) => {
    return await request.get({ url: `/agriculture/monitoring-threshold/get?id=` + id })
  },

  // 新增监测阈值
  createMonitoringThreshold: async (data: MonitoringThresholdVO) => {
    return await request.post({ url: `/agriculture/monitoring-threshold/create`, data })
  },

  // 修改监测阈值
  updateMonitoringThreshold: async (data: MonitoringThresholdVO) => {
    return await request.put({ url: `/agriculture/monitoring-threshold/update`, data })
  },

  // 删除监测阈值
  deleteMonitoringThreshold: async (id: number) => {
    return await request.delete({ url: `/agriculture/monitoring-threshold/delete?id=` + id })
  },

  // 导出监测阈值 Excel
  exportMonitoringThreshold: async (params) => {
    return await request.download({ url: `/agriculture/monitoring-threshold/export-excel`, params })
  }
}