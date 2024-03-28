import request from '@/config/axios'

// 设备信息 VO
export interface DeviceOverviewVO {
  categoryName: string // 类型
  imgId: string // 图片
  deviceType: string // 设备类型
  total: string // 总数
  online: string // 在线
  offline: string // 离线
  fault: string // 故障
}

// 设备信息 API
export const DeviceOverviewApi = {
  // 查询设备总览
  getDeviceOverview: async () => {
    return await request.get({ url: `/agriculture/big-screen/deviceInfoCard`})
  },
}
