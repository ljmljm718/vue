import request from '@/config/axios'

// 营销方案 VO
export interface MarketingProgramVO {
  id: string // 主键
  schemeName: string // 方案名称
  briefIntroduction: string // 简介
  marketingCreator: string // 创作人
  marketingUploadTime: Date // 上传时间
  marketingCategory: string // 分类
  marketingTags: string // 标签
  fileManagement: string // 文件管理
  coverImage: string // 封面图片
  marketingType: string // 营销推广类型
  reserveOne: string // 备用一
  reserveTwo: string // 备用二
  reserveThree: string // 备用三
}

// 营销方案 API
export const MarketingProgramApi = {
  // 查询营销方案分页
  getMarketingProgramPage: async (params: any) => {
    return await request.get({ url: `/agriculture/marketing-program/page`, params })
  },

  // 查询营销方案详情
  getMarketingProgram: async (id: any) => {
    return await request.get({ url: `/agriculture/marketing-program/get?id=` + id })
  },

  // 新增营销方案
  createMarketingProgram: async (data: MarketingProgramVO) => {
    return await request.post({ url: `/agriculture/marketing-program/create`, data })
  },

  // 修改营销方案
  updateMarketingProgram: async (data: MarketingProgramVO) => {
    return await request.put({ url: `/agriculture/marketing-program/update`, data })
  },

  // 删除营销方案
  deleteMarketingProgram: async (id: number) => {
    return await request.delete({ url: `/agriculture/marketing-program/delete?id=` + id })
  },

  // 导出营销方案 Excel
  exportMarketingProgram: async (params) => {
    return await request.download({ url: `/agriculture/marketing-program/export-excel`, params })
  },
}
