import request from '@/config/axios'

// 预警记录 VO
export interface WarningRecordVO {
  id: number // 主键
  parkCode: string // 园区编号
  plotCode: string // 地块编号
  deviceCode: string // 设备编号
  warnInfo: string // 预警信息
  warnTitle: string // 预警标题
  currentValue: string // 当前值
  unit: string // 单位
  threshold: string // 阈值
  warnTime: Date // 预警时间
  warnStatus: string // 预警状态
  dealTime: Date // 处理时间
  dealPerson: string // 处理人
  dealPersonId: string // 处理人编号
  dealInfo: string // 处理信息
  deviceType: string // 设备类型
  imgId: string // 预警图片
  deviceName: string // 设备名称
}

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
  url: string // URL
  remark: string // 备注
}

// 预警记录 API
export const WarningRecordApi = {
  // 查询预警记录分页
  getWarningRecordPage: async (params: any) => {
    return await request.get({ url: `/kaizhou/warning-record/page`, params })
  },

  // 查询预警记录详情
  getWarningRecord: async (id: number) => {
    return await request.get({ url: `/kaizhou/warning-record/get?id=` + id })
  },

  // 新增预警记录
  createWarningRecord: async (data: WarningRecordVO) => {
    return await request.post({ url: `/kaizhou/warning-record/create`, data })
  },

  // 修改预警记录
  updateWarningRecord: async (data: WarningRecordVO) => {
    return await request.put({ url: `/kaizhou/warning-record/update`, data })
  },

  // 删除预警记录
  deleteWarningRecord: async (id: number) => {
    return await request.delete({ url: `/kaizhou/warning-record/delete?id=` + id })
  },

  // 导出预警记录 Excel
  exportWarningRecord: async (params) => {
    return await request.download({ url: `/kaizhou/warning-record/export-excel`, params })
  },

  // 查询设备管理分页
  getDeviceBasePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/warning-record/device/page`, params })
  },
}
