import request from '@/config/axios'

// 采收管理 VO
export interface HarvestManagementVO {
  id: string // 主键
  recordNum: string // 记录编号
  upTime: Date // 上传时间
  belongPark: string // 基地
  belongPlot: string // 地块
  harvestVolume: string // 采收量
  laborQuantity: string // 人工数量
  remark: string // 备注
  parkName: string,
  parkDetailName: string,
}

// 采收管理 API
export const HarvestManagementApi = {
  // 查询采收管理分页
  getHarvestManagementPage: async (params: any) => {
    return await request.get({ url: `/agriculture/harvest-management/page`, params })
  },

  // 查询采收管理详情
  getHarvestManagement: async (id: number) => {
    return await request.get({ url: `/agriculture/harvest-management/get?id=` + id })
  },

  // 新增采收管理
  createHarvestManagement: async (data: HarvestManagementVO) => {
    return await request.post({ url: `/agriculture/harvest-management/create`, data })
  },

  // 修改采收管理
  updateHarvestManagement: async (data: HarvestManagementVO) => {
    return await request.put({ url: `/agriculture/harvest-management/update`, data })
  },

  // 删除采收管理
  deleteHarvestManagement: async (id: number) => {
    return await request.delete({ url: `/agriculture/harvest-management/delete?id=` + id })
  },

  // 导出采收管理 Excel
  exportHarvestManagement: async (params) => {
    return await request.download({ url: `/agriculture/harvest-management/export-excel`, params })
  },
}
