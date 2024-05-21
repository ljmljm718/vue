import request from '@/config/axios'

// 监控设备通知 VO
export interface MonitoringEquipmentNoticeVO {
  id: string // 主键
  deviceId: string // 设备ID
  deviceName: string // 设备名称
  monitoringBaseId: string // 监控基地ID
  monitoringBaseName: string // 监控基地名称
  monitoringPlotId: string // 监控地块ID
  monitoringPlotName: string // 监控地块名称
  captured: string // 抓拍图片或视频
  videoLink: string // 视频链接
  noticeEvent: string // 通知事件类型
  recordTime: Date // 记录时间
  remarks: string // 备注
}

// 监控设备通知 API
export const MonitoringEquipmentNoticeApi = {
  // 查询监控设备通知分页
  getMonitoringEquipmentNoticePage: async (params: any) => {
    return await request.get({ url: `/agriculture/monitoring-equipment-notice/page`, params })
  },

  // 查询监控设备通知详情
  getMonitoringEquipmentNotice: async (id: number) => {
    return await request.get({ url: `/agriculture/monitoring-equipment-notice/get?id=` + id })
  },

  // 新增监控设备通知
  createMonitoringEquipmentNotice: async (data: MonitoringEquipmentNoticeVO) => {
    return await request.post({ url: `/agriculture/monitoring-equipment-notice/create`, data })
  },

  // 修改监控设备通知
  updateMonitoringEquipmentNotice: async (data: MonitoringEquipmentNoticeVO) => {
    return await request.put({ url: `/agriculture/monitoring-equipment-notice/update`, data })
  },

  // 删除监控设备通知
  deleteMonitoringEquipmentNotice: async (id: number) => {
    return await request.delete({ url: `/agriculture/monitoring-equipment-notice/delete?id=` + id })
  },

  // 导出监控设备通知 Excel
  exportMonitoringEquipmentNotice: async (params) => {
    return await request.download({ url: `/agriculture/monitoring-equipment-notice/export-excel`, params })
  }
}