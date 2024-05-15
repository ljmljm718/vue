import request from '@/config/axios'

// 监控设备数据 VO
export interface MonitoringEquipmentDataVO {
  id: string // 主键
  deviceId: string // 设备ID
  deviceName: string // 设备名称
  monitoringBaseId: string // 监控基地ID
  monitoringBaseName: string // 监控基地名称
  monitoringPlotId: string // 监控地块ID
  monitoringPlotName: string // 监控地块名称
  capturedImage: string // 抓拍图片
  videoLink: string // 视频链接
  remarks: string // 备注
  reserveOne: string // 备用一
  reserveTwo: Date // 备用二:图片记录时间
  reserveThree: string // 备用三
}

// 监控设备数据 API
export const MonitoringEquipmentDataApi = {
  // 查询监控设备数据分页
  getMonitoringEquipmentDataPage: async (params: any) => {
    return await request.get({ url: `/agri/monitoring-equipment-data/page`, params })
  },

  // 查询监控设备数据详情
  getMonitoringEquipmentData: async (id: number) => {
    return await request.get({ url: `/agri/monitoring-equipment-data/get?id=` + id })
  },

  // 新增监控设备数据
  createMonitoringEquipmentData: async (data: MonitoringEquipmentDataVO) => {
    return await request.post({ url: `/agri/monitoring-equipment-data/create`, data })
  },

  // 修改监控设备数据
  updateMonitoringEquipmentData: async (data: MonitoringEquipmentDataVO) => {
    return await request.put({ url: `/agri/monitoring-equipment-data/update`, data })
  },

  // 删除监控设备数据
  deleteMonitoringEquipmentData: async (id: number) => {
    return await request.delete({ url: `/agri/monitoring-equipment-data/delete?id=` + id })
  },

  // 导出监控设备数据 Excel
  exportMonitoringEquipmentData: async (params) => {
    return await request.download({ url: `/agri/monitoring-equipment-data/export-excel`, params })
  },
}
