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
}

// 设备信息 API
export const DeviceInfoApi = {
  // 查询设备信息分页
  getDeviceInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/device-info/page`, params })
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

}
