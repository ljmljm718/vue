import request from '@/config/axios'

// 烘干工艺管理 VO
export interface DryingProcessManagementVO {
  id: string // 主键
  equipmentCode: string // 设备编码
  equipmentName: string // 设备名称
  dryingMethod: string // 烘干方式
  heatingTime: string // 加热时间
  dryingTemperature: string // 烘干温度
  equipmentSpeed: string // 设备转速
  suitableCrops: string // 适宜作物
  yyRemarks: string // 备注
  reserveOne: string // 备用一
  reserveTwo: string // 备用二
  reserveThree: string // 备用三
}

// 烘干工艺管理 API
export const DryingProcessManagementApi = {
  // 查询烘干工艺管理分页
  getDryingProcessManagementPage: async (params: any) => {
    return await request.get({ url: `/baibu/drying-process-management/page`, params })
  },

  // 查询烘干工艺管理详情
  getDryingProcessManagement: async (id: number) => {
    return await request.get({ url: `/baibu/drying-process-management/get?id=` + id })
  },

  // 新增烘干工艺管理
  createDryingProcessManagement: async (data: DryingProcessManagementVO) => {
    return await request.post({ url: `/baibu/drying-process-management/create`, data })
  },

  // 修改烘干工艺管理
  updateDryingProcessManagement: async (data: DryingProcessManagementVO) => {
    return await request.put({ url: `/baibu/drying-process-management/update`, data })
  },

  // 删除烘干工艺管理
  deleteDryingProcessManagement: async (id: number) => {
    return await request.delete({ url: `/baibu/drying-process-management/delete?id=` + id })
  },

  // 导出烘干工艺管理 Excel
  exportDryingProcessManagement: async (params) => {
    return await request.download({ url: `/baibu/drying-process-management/export-excel`, params })
  },
}