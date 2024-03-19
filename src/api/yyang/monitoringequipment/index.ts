import request from '@/config/axios'

// 监控设备 VO
export interface MonitoringEquipmentVO {
  id: string // 编码
  equipmentName: string // 设备名称
  yyLongitude: string // 经度
  yyLatitude: string // 纬度
  yyLocation: string // 位置
  activationTime: Date // 启用时间
  yyStatus: string // 状态
  monitoringBaseId: string // 监控基地ID
  capturedImage: string // 抓拍图片
  videoUrl: string // 视频URL
  yyRemarks: string // 备注
  reserveOne: string // 备用一
  reserveTwo: string // 备用二
  reserveThree: string // 备用三
}

// 监控设备 API
export const MonitoringEquipmentApi = {
  // 查询监控设备分页
  getMonitoringEquipmentPage: async (params: any) => {
    return await request.get({ url: `/yyang/monitoring-equipment/page`, params })
  },

  // 查询监控设备详情
  getMonitoringEquipment: async (id: number) => {
    return await request.get({ url: `/yyang/monitoring-equipment/get?id=` + id })
  },

  // 新增监控设备
  createMonitoringEquipment: async (data: MonitoringEquipmentVO) => {
    return await request.post({ url: `/yyang/monitoring-equipment/create`, data })
  },

  // 修改监控设备
  updateMonitoringEquipment: async (data: MonitoringEquipmentVO) => {
    return await request.put({ url: `/yyang/monitoring-equipment/update`, data })
  },

  // 删除监控设备
  deleteMonitoringEquipment: async (id: number) => {
    return await request.delete({ url: `/yyang/monitoring-equipment/delete?id=` + id })
  },

  // 导出监控设备 Excel
  exportMonitoringEquipment: async (params) => {
    return await request.download({ url: `/yyang/monitoring-equipment/export-excel`, params })
  },
}