import request from '@/config/axios'

// 设备信息 VO
export interface DeviceInfoVO {
  id: string // 主键id
  deviceCode: string // 设备号
  deviceName: string // 名称
  deviceType: string // 设备类型
  longitude: string // 经度
  latitude: string // 纬度
  deviceStatus: string // 状态
  belongPark: string // 所属基地
  belongPlot: string // 所属地块
  imgId: string // 图片
  remark: string // 备注
  deptId: number // 部门编号
  userId: number // 用户编号
  url: string // 监控视频
  location: string // 位置
  deviceKind: string // 设备类型
  deviceMonitorType: any //设备检测类型
  dtu: string // 终端id
  channelId: string // 通道号

  //新增的两个字段
  parkName: string //基地名称
  parkDetailName: string //地块名称
}

// 设备信息 API
export const DeviceInfoApi = {
  // 查询设备信息分页
  getDeviceInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/device-info/page`, params })
  },

  // 查询设备信息不分页
  getDeviceInfoNoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/device-info/noPage`, params })
  },

  // 查询设备信息详情
  getDeviceInfo: async (id: number) => {
    return await request.get({ url: `/agriculture/device-info/get?id=` + id })
  },

  // 新增设备信息
  createDeviceInfo: async (data: DeviceInfoVO) => {
    return await request.post({ url: `/agriculture/device-info/create`, data })
  },

  // 修改设备信息
  updateDeviceInfo: async (data: DeviceInfoVO) => {
    return await request.put({ url: `/agriculture/device-info/update`, data })
  },

  // 删除设备信息
  deleteDeviceInfo: async (id: number) => {
    return await request.delete({ url: `/agriculture/device-info/delete?id=` + id })
  },

  // 导出设备信息 Excel
  exportDeviceInfo: async (params) => {
    return await request.download({ url: `/agriculture/device-info/export-excel`, params })
  },

  // 绑定定时任务与设备信息
  jobBindDevice: async (data: any) => {
    return await request.post({ url: `/agriculture/device-info/job-bind-device`, data })
  },

  // 修改设备状态
  updateDeviceStatus: async (id: number, deviceStatus: string) => {
    return await request.put({ url: `/agriculture/device-info/updateStatus?id=` + id + "&deviceStatus=" + deviceStatus})
  },

  // 查询设备信息分页
  getDeviceInfoByIds: async (data) => {
    return await request.post({ url: `/agriculture/device-info/pageByIds`, data })
  },

  // 查询设备检测类型
  getDeviceMonitorType: async () => {
    return await request.get({ url: `/agriculture/device-info/getType`})
  },

  // 刷新设备状态
  refreshDeviceStatus: async () => {
    return await request.put({ url: `/agriculture/device-info/refresh-status`})
  },
}
