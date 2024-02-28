import request from '@/config/axios'

// 预警规则-设备关联 VO
export interface WarningRuleDeviceVO {
  id: number // 主键
  warnRuleId: string // 预警规则id
  deviceId: string // 设备id
}
export interface RuleDeviceDTO {
  warnRuleId: string // 预警规则id
  deviceId: string[] // 设备id
}

// 预警规则-设备关联 API
export const WarningRuleDeviceApi = {
  // 查询预警规则-设备关联分页
  getWarningRuleDevicePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/warning-rule-device/page`, params })
  },

  // 查询预警规则-设备关联详情
  getWarningRuleDevice: async (id: number) => {
    return await request.get({ url: `/kaizhou/warning-rule-device/get?id=` + id })
  },

  // 新增预警规则-设备关联
  createWarningRuleDevice: async (data: WarningRuleDeviceVO) => {
    return await request.post({ url: `/kaizhou/warning-rule-device/create`, data })
  },

  // 修改预警规则-设备关联
  updateWarningRuleDevice: async (data: WarningRuleDeviceVO) => {
    return await request.put({ url: `/kaizhou/warning-rule-device/update`, data })
  },

  // 删除预警规则-设备关联
  deleteWarningRuleDevice: async (id: number) => {
    return await request.delete({ url: `/kaizhou/warning-rule-device/delete?id=` + id })
  },

  // 导出预警规则-设备关联 Excel
  exportWarningRuleDevice: async (params) => {
    return await request.download({ url: `/kaizhou/warning-rule-device/export-excel`, params })
  },

  // 绑定设备
  WarnRuleBindDevice: async (data: RuleDeviceDTO) => {
    return await request.post({ url: `/kaizhou/warning-rule-device/bind`, data })
  },
}
