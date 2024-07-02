import request from '@/config/axios'

// 设备数据规则 VO
export interface EquipmentDataRuleVO {
  id: string // 主键
  dtuId: string // 终端id
  channelId: string // 通道
  param: string // 参数
  monitoringType: string // 监测类型
  ruleType: string // 规则类型
  rule: string // 规则
  ruleUnit: string // 单位
  deviceId: string // 设备编号
}

// 设备数据规则 API
export const EquipmentDataRuleApi = {
  // 查询设备数据规则分页
  getEquipmentDataRulePage: async (params: any) => {
    return await request.get({ url: `/agriculture/equipment-data-rule/page`, params })
  },

  // 查询设备数据规则详情
  getEquipmentDataRule: async (id: number) => {
    return await request.get({ url: `/agriculture/equipment-data-rule/get?id=` + id })
  },

  // 新增设备数据规则
  createEquipmentDataRule: async (data: EquipmentDataRuleVO) => {
    return await request.post({ url: `/agriculture/equipment-data-rule/create`, data })
  },

  // 修改设备数据规则
  updateEquipmentDataRule: async (data: EquipmentDataRuleVO) => {
    return await request.put({ url: `/agriculture/equipment-data-rule/update`, data })
  },

  // 删除设备数据规则
  deleteEquipmentDataRule: async (id: number) => {
    return await request.delete({ url: `/agriculture/equipment-data-rule/delete?id=` + id })
  },

  // 导出设备数据规则 Excel
  exportEquipmentDataRule: async (params) => {
    return await request.download({ url: `/agriculture/equipment-data-rule/export-excel`, params })
  },
}