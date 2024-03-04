import request from '@/config/axios'

// 物联网设备在线监测 VO
export interface OnLineMonitoringVO {
  id: string // 主键
  deviceCode: string // 设备号
  deviceName: string // 设备名称
  connection: string // 连接属性
  belongPlot: string // 所属地块
  presence: string // 在线状态
  upTime: string // 上传时间
  remark: string // 备注
}

// 物联网设备在线监测 API
export const OnLineMonitoringApi = {
  // 查询物联网设备在线监测分页
  getOnLineMonitoringPage: async (params: any) => {
    return await request.get({ url: `/wushan/on-line-monitoring/page`, params })
  },

  // 查询物联网设备在线监测详情
  getOnLineMonitoring: async (id: number) => {
    return await request.get({ url: `/wushan/on-line-monitoring/get?id=` + id })
  },

  // 新增物联网设备在线监测
  createOnLineMonitoring: async (data: OnLineMonitoringVO) => {
    return await request.post({ url: `/wushan/on-line-monitoring/create`, data })
  },

  // 修改物联网设备在线监测
  updateOnLineMonitoring: async (data: OnLineMonitoringVO) => {
    return await request.put({ url: `/wushan/on-line-monitoring/update`, data })
  },

  // 删除物联网设备在线监测
  deleteOnLineMonitoring: async (id: number) => {
    return await request.delete({ url: `/wushan/on-line-monitoring/delete?id=` + id })
  },

  // 导出物联网设备在线监测 Excel
  exportOnLineMonitoring: async (params) => {
    return await request.download({ url: `/wushan/on-line-monitoring/export-excel`, params })
  },
}
