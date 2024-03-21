import request from '@/config/axios'

// 预警规则-设备关联 VO
export interface AgriWarningRuleDeviceVO {
  id: number // 主键
  warnRuleId: string // 预警规则id
  deviceId: string // 设备id
}

// 预警规则-设备关联 API
export const AgriWarningRuleDeviceApi = {
  // 查询预警规则-设备关联分页
  getAgriWarningRuleDevicePage: async (params: any) => {
    return await request.get({ url: `/agriculture/agri-warning-rule-device/page`, params })
  },

  // 查询预警规则-设备关联详情
  getAgriWarningRuleDevice: async (id: number) => {
    return await request.get({ url: `/agriculture/agri-warning-rule-device/get?id=` + id })
  },

  // 新增预警规则-设备关联
  createAgriWarningRuleDevice: async (data: AgriWarningRuleDeviceVO) => {
    return await request.post({ url: `/agriculture/agri-warning-rule-device/create`, data })
  },

  // 修改预警规则-设备关联
  updateAgriWarningRuleDevice: async (data: AgriWarningRuleDeviceVO) => {
    return await request.put({ url: `/agriculture/agri-warning-rule-device/update`, data })
  },

  // 删除预警规则-设备关联
  deleteAgriWarningRuleDevice: async (id: number) => {
    return await request.delete({ url: `/agriculture/agri-warning-rule-device/delete?id=` + id })
  },

  // 导出预警规则-设备关联 Excel
  exportAgriWarningRuleDevice: async (params) => {
    return await request.download({ url: `/agriculture/agri-warning-rule-device/export-excel`, params })
  },
}