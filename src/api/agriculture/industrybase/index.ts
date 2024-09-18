import request from '@/config/axios'

// 产业介绍 VO
export interface IndustryBaseVO {
  id: string // 主键
  villageName: string // 村
  industryName: string // 产业名称
  imgId: string // 图片
  marketDemandScale: string // 市场需求规格
  keyDemandMarket: string // 主要需求市场
  marketDevTrend: string // 市场发展趋势
  policy: string // 政策法规
  efficacy: string // 价值功效
  baseIntr: string // 基地介绍
  videoUrl: string // 宣传视频
}

// 产业介绍 API
export const IndustryBaseApi = {
  // 查询产业介绍分页
  getIndustryBasePage: async (params: any) => {
    return await request.get({ url: `/agriculture/industry-base/page`, params })
  },

  // 查询产业介绍详情
  getIndustryBase: async (id: number) => {
    return await request.get({ url: `/agriculture/industry-base/get?id=` + id })
  },

  // 新增产业介绍
  createIndustryBase: async (data: IndustryBaseVO) => {
    return await request.post({ url: `/agriculture/industry-base/create`, data })
  },

  // 修改产业介绍
  updateIndustryBase: async (data: IndustryBaseVO) => {
    return await request.put({ url: `/agriculture/industry-base/update`, data })
  },

  // 删除产业介绍
  deleteIndustryBase: async (id: number) => {
    return await request.delete({ url: `/agriculture/industry-base/delete?id=` + id })
  },

  // 导出产业介绍 Excel
  exportIndustryBase: async (params) => {
    return await request.download({ url: `/agriculture/industry-base/export-excel`, params })
  }
}
