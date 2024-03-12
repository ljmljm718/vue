import request from '@/config/axios'

// 设备管理 VO
export interface DeviceBaseVO {
  id: string // 主键id
  deviceCode: string // 设备号
  deviceName: string // 名称
  kinds: string // 种类
  deviceType: string // 设备类型
  longitude: string // 经度
  latitude: string // 纬度
  deviceStatus: string // 状态
  belongPark: string // 所属基地
  belongPlot: string // 所属地块
  belongParkName: string // 所属基地名称
  belongPlotName: string // 所属地块名称
  url: string // URL
}

export interface DeviceRuleDTO {
  deviceId: string // 设备id
  warnRuleId: string[] // 预警规则id
}

// 设备管理 API
export const DeviceBaseApi = {
  // 查询设备管理分页
  getDeviceBasePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/device-base/page`, params })
  },

  // 查询设备管理详情
  getDeviceBase: async (id: number) => {
    return await request.get({ url: `/kaizhou/device-base/get?id=` + id })
  },

  // 新增设备管理
  createDeviceBase: async (data: DeviceBaseVO) => {
    return await request.post({ url: `/kaizhou/device-base/create`, data })
  },

  // 修改设备管理
  updateDeviceBase: async (data: DeviceBaseVO) => {
    return await request.put({ url: `/kaizhou/device-base/update`, data })
  },

  // 删除设备管理
  deleteDeviceBase: async (id: number) => {
    return await request.delete({ url: `/kaizhou/device-base/delete?id=` + id })
  },

  // 导出设备管理 Excel
  exportDeviceBase: async (params) => {
    return await request.download({ url: `/kaizhou/device-base/export-excel`, params })
  },

  // 绑定设备
  DeviceBindWarnRule: async (data: DeviceRuleDTO) => {
    return await request.post({ url: `/kaizhou/device-base/bind`, data })
  },

  // 根据预警规则查询设备
  selectWarnRuleByDeviceId: async (deviceId: string) => {
    return await request.get({ url: `/kaizhou/device-base/list/rule?deviceId=` + deviceId })
  },
}
