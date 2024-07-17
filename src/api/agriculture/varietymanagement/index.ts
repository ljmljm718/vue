import request from '@/config/axios'

// 品种管理 VO
export interface VarietyManagementVO {
  id: string // 主键
  varietyName: string // 品种名称
  varietyCode: string // 品种编码
  images: string // 图片
  categoryId: string // 品类ID
  categoryName: string // 品类名称
  categorySource: string // 品种来源
  categoryStigma: string // 品种特征
  areaDistribution: string // 分布地区
  briefIntroduction: string // 简介
  status: string // 启用停用
  remark2: string // 备注1
}

// 品种管理 API
export const VarietyManagementApi = {
  // 查询品种管理分页
  getVarietyManagementPage: async (params: any) => {
    return await request.get({ url: `/agriculture/variety-management/page`, params })
  },

  // 查询品种管理详情
  getVarietyManagement: async (id: number) => {
    return await request.get({ url: `/agriculture/variety-management/get?id=` + id })
  },

  // 新增品种管理
  createVarietyManagement: async (data: VarietyManagementVO) => {
    return await request.post({ url: `/agriculture/variety-management/create`, data })
  },

  // 修改品种管理
  updateVarietyManagement: async (data: VarietyManagementVO) => {
    return await request.put({ url: `/agriculture/variety-management/update`, data })
  },

  // 删除品种管理
  deleteVarietyManagement: async (id: number) => {
    return await request.delete({ url: `/agriculture/variety-management/delete?id=` + id })
  },

  // 导出品种管理 Excel
  exportVarietyManagement: async (params) => {
    return await request.download({ url: `/agriculture/variety-management/export-excel`, params })
  }
}
