import request from '@/config/axios'

// 溶解氧因素与增氧设备关联 VO
export interface OxygenFactorEquipVO {
  id: string // 主键
  factorId: string // 因素ID
  equipId: string // 增氧设备ID
  baseId: string // 基地ID
  plotId: string // 地块ID
}

// 溶解氧因素与增氧设备关联 API
export const OxygenFactorEquipApi = {
  // 查询溶解氧因素与增氧设备关联分页
  getOxygenFactorEquipPage: async (params: any) => {
    return await request.get({ url: `/agriculture/oxygen-factor-equip/page`, params })
  },

  // 查询溶解氧因素与增氧设备关联详情
  getOxygenFactorEquip: async (id: number) => {
    return await request.get({ url: `/agriculture/oxygen-factor-equip/get?id=` + id })
  },

  // 新增溶解氧因素与增氧设备关联
  createOxygenFactorEquip: async (data: OxygenFactorEquipVO) => {
    return await request.post({ url: `/agriculture/oxygen-factor-equip/create`, data })
  },

  // 修改溶解氧因素与增氧设备关联
  updateOxygenFactorEquip: async (data: OxygenFactorEquipVO) => {
    return await request.put({ url: `/agriculture/oxygen-factor-equip/update`, data })
  },

  // 删除溶解氧因素与增氧设备关联
  deleteOxygenFactorEquip: async (id: number) => {
    return await request.delete({ url: `/agriculture/oxygen-factor-equip/delete?id=` + id })
  },

  // 导出溶解氧因素与增氧设备关联 Excel
  exportOxygenFactorEquip: async (params) => {
    return await request.download({ url: `/agriculture/oxygen-factor-equip/export-excel`, params })
  },
}