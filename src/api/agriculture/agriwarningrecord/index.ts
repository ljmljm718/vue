import request from '@/config/axios'

// 预警记录 VO
export interface AgriWarningRecordVO {
  id: number // 主键
  parkCode: string // 园区编号
  plotCode: string // 地块编号
  deviceCode: string // 设备编号
  warnInfo: string // 预警信息
  currentValue: string // 当前值
  threshold: string // 阈值
  warnTime: Date // 预警时间
  warnStatus: string // 预警状态
  dealTime: Date // 处理时间
  dealPerson: string // 处理人
  dealPersonId: string // 处理人编号
  dealInfo: string // 处理信息
  deviceType: string // 设备类型
  imgId: string // 预警图片
  warnType: string // 预警类型
  warnUnit: string // 预警单位
  warnTitle: string // 预警标题
  deviceName: string // 设备名称
}

// 预警记录 API
export const AgriWarningRecordApi = {
  // 查询预警记录分页
  getAgriWarningRecordPage: async (params: any) => {
    return await request.get({ url: `/agriculture/agri-warning-record/page`, params })
  },

  // 查询预警记录详情
  getAgriWarningRecord: async (id: number) => {
    return await request.get({ url: `/agriculture/agri-warning-record/get?id=` + id })
  },

  // 新增预警记录
  createAgriWarningRecord: async (data: AgriWarningRecordVO) => {
    return await request.post({ url: `/agriculture/agri-warning-record/create`, data })
  },

  // 修改预警记录
  updateAgriWarningRecord: async (data: AgriWarningRecordVO) => {
    return await request.put({ url: `/agriculture/agri-warning-record/update`, data })
  },

  // 删除预警记录
  deleteAgriWarningRecord: async (id: number) => {
    return await request.delete({ url: `/agriculture/agri-warning-record/delete?id=` + id })
  },

  // 导出预警记录 Excel
  exportAgriWarningRecord: async (params) => {
    return await request.download({ url: `/agriculture/agri-warning-record/export-excel`, params })
  },
}
