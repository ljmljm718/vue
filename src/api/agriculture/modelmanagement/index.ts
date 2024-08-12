import request from '@/config/axios'

// 模型管理 VO
export interface ModelManagementVO {
  id: string // 主键（模型编码）
  modelName: string // 模型名称
  modelType: string // 模型类型
  belongCategoryId: string // 关联品类id
  belongCategory: string // 关联品类
  belongVarietyId: string // 关联品种id
  belongVariety: string // 关联品种
  modelImageId: string // 模型图片id
  modelFileId: string // 模型文件id
  enabledStatus: number // 启用状态（0正常1停用）
  description: string // 描述
}

// 模型管理 API
export const ModelManagementApi = {
  // 查询模型管理分页
  getModelManagementPage: async (params: any) => {
    return await request.get({ url: `/agriculture/model-management/page`, params })
  },

  // 查询模型管理不分页
  getModelManagementNoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/model-management/noPage`, params })
  },

  // 查询模型管理详情
  getModelManagement: async (id: number) => {
    return await request.get({ url: `/agriculture/model-management/get?id=` + id })
  },

  // 新增模型管理
  createModelManagement: async (data: ModelManagementVO) => {
    return await request.post({ url: `/agriculture/model-management/create`, data })
  },

  // 修改模型管理
  updateModelManagement: async (data: ModelManagementVO) => {
    return await request.put({ url: `/agriculture/model-management/update`, data })
  },

  // 删除模型管理
  deleteModelManagement: async (id: number) => {
    return await request.delete({ url: `/agriculture/model-management/delete?id=` + id })
  },

  // 导出模型管理 Excel
  exportModelManagement: async (params) => {
    return await request.download({ url: `/agriculture/model-management/export-excel`, params })
  },

  // 修改模型管理状态
  updateModelManagementStatus: async (id: any, enabledStatus: any) => {
    const data = {
      id,
      enabledStatus
    }
    return await request.put({ url: `/agriculture/model-management/updateStatus`, data })
  },
}
