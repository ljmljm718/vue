import request from '@/config/axios'

// 设备历史状态 VO
export interface DeviceHistoryStatusVO {
  id: string // 主键
  deviceId: string // 设备id
  deviceStatus: string // 设备状态
}

// 设备历史状态 API
export const DeviceHistoryStatusApi = {
  // 查询设备历史状态分页
  getDeviceHistoryStatusPage: async (params: any) => {
    return await request.get({ url: `/agriculture/device-history-status/page`, params })
  },

  // 查询设备历史状态详情
  getDeviceHistoryStatus: async (id: number) => {
    return await request.get({ url: `/agriculture/device-history-status/get?id=` + id })
  },

  // 新增设备历史状态
  createDeviceHistoryStatus: async (data: DeviceHistoryStatusVO) => {
    return await request.post({ url: `/agriculture/device-history-status/create`, data })
  },

  // 修改设备历史状态
  updateDeviceHistoryStatus: async (data: DeviceHistoryStatusVO) => {
    return await request.put({ url: `/agriculture/device-history-status/update`, data })
  },

  // 删除设备历史状态
  deleteDeviceHistoryStatus: async (id: number) => {
    return await request.delete({ url: `/agriculture/device-history-status/delete?id=` + id })
  },

  // 导出设备历史状态 Excel
  exportDeviceHistoryStatus: async (params) => {
    return await request.download({ url: `/agriculture/device-history-status/export-excel`, params })
  }
}