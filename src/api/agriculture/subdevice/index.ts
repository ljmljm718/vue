import request from '@/config/axios'

// 子设备管理 VO
export interface SubDeviceVO {
  id: string // 主键
  subDevicesNum: string // 子设备编号
  devicesId: string // 所属设备
  subDevicesName: string // 子设备名称
  swithState: string // 开关状态
  remark: string // 备注
}

// 子设备管理 API
export const SubDeviceApi = {
  // 查询子设备管理分页
  getSubDevicePage: async (params: any) => {
    return await request.get({ url: `/agriculture/sub-device/page`, params })
  },

  // 查询子设备管理详情
  getSubDevice: async (id: number) => {
    return await request.get({ url: `/agriculture/sub-device/get?id=` + id })
  },

  // 新增子设备管理
  createSubDevice: async (data: SubDeviceVO) => {
    return await request.post({ url: `/agriculture/sub-device/create`, data })
  },

  // 修改子设备管理
  updateSubDevice: async (data: SubDeviceVO) => {
    return await request.put({ url: `/agriculture/sub-device/update`, data })
  },

  // 删除子设备管理
  deleteSubDevice: async (id: number) => {
    return await request.delete({ url: `/agriculture/sub-device/delete?id=` + id })
  },

  // 导出子设备管理 Excel
  exportSubDevice: async (params) => {
    return await request.download({ url: `/agriculture/sub-device/export-excel`, params })
  },
}
