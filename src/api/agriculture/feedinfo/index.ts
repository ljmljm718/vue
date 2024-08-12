import request from '@/config/axios'

// 投喂记录 VO
export interface FeedInfoVO {
  id: number // ID
  belongPark: string // 所属基地
  parkName: string // 基地名称
  belongPlot: string // 所属地块
  plotName: string // 地块名称
  crabNum: string // 螃蟹数量
  feedType: string // 饲料种类
  feedNum: string // 投喂数量
  feedOne: string // 备用字段
  feedTime: Date // 投喂时间
}

// 投喂记录 API
export const FeedInfoApi = {
  // 查询投喂记录分页
  getFeedInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/feed-info/page`, params })
  },

  // 查询投喂记录详情
  getFeedInfo: async (id: number) => {
    return await request.get({ url: `/agriculture/feed-info/get?id=` + id })
  },

  // 新增投喂记录
  createFeedInfo: async (data: FeedInfoVO) => {
    return await request.post({ url: `/agriculture/feed-info/create`, data })
  },

  // 修改投喂记录
  updateFeedInfo: async (data: FeedInfoVO) => {
    return await request.put({ url: `/agriculture/feed-info/update`, data })
  },

  // 删除投喂记录
  deleteFeedInfo: async (id: number) => {
    return await request.delete({ url: `/agriculture/feed-info/delete?id=` + id })
  },

  // 导出投喂记录 Excel
  exportFeedInfo: async (params) => {
    return await request.download({ url: `/agriculture/feed-info/export-excel`, params })
  }
}