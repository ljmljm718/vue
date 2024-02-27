import request from '@/config/axios'

// 设备数据 VO
export interface DeviceDataVO {
  id: string // 主键id
  deviceCode: string // 设备编号
  deviceType: string // 设备类型
  type: string // 监测类型
  dataValue: string // 数据值
  unit: string // 单位
  collectTime: string // 采集时间
}

// 设备数据 API
export const DeviceDataApi = {
  // 查询设备数据分页
  getDeviceDataPage: async (params: any) => {
    return await request.get({ url: `/kaizhou/device-data/page`, params })
  },

  // 查询设备数据详情
  getDeviceData: async (id: number) => {
    return await request.get({ url: `/kaizhou/device-data/get?id=` + id })
  },

  // 新增设备数据
  createDeviceData: async (data: DeviceDataVO) => {
    return await request.post({ url: `/kaizhou/device-data/create`, data })
  },

  // 修改设备数据
  updateDeviceData: async (data: DeviceDataVO) => {
    return await request.put({ url: `/kaizhou/device-data/update`, data })
  },

  // 删除设备数据
  deleteDeviceData: async (id: number) => {
    return await request.delete({ url: `/kaizhou/device-data/delete?id=` + id })
  },

  // 导出设备数据 Excel
  exportDeviceData: async (params) => {
    return await request.download({ url: `/kaizhou/device-data/export-excel`, params })
  },
}