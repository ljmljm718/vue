import request from '@/config/axios'

// 主题订阅 VO
export interface TopicDataVO {
  id: number // 主键
  topicName: string // 主题名称
  topicKey: string // 主题关键字
  topicPath: string // 主题
  topicUnit: string // 单位
  topicIsorder: string // 是否订阅
  topicClass: string // 处理类
  topicNote: string // 备注
  topicType: string // 主题类型
}

// 主题订阅 API
export const TopicDataApi = {
  // 查询主题订阅分页
  getTopicDataPage: async (params: any) => {
    return await request.get({ url: `/agriculture/topic-data/page`, params })
  },

  // 查询主题订阅详情
  getTopicData: async (id: number) => {
    return await request.get({ url: `/agriculture/topic-data/get?id=` + id })
  },

  // 新增主题订阅
  createTopicData: async (data: TopicDataVO) => {
    return await request.post({ url: `/agriculture/topic-data/create`, data })
  },

  // 修改主题订阅
  updateTopicData: async (data: TopicDataVO) => {
    return await request.put({ url: `/agriculture/topic-data/update`, data })
  },

  // 删除主题订阅
  deleteTopicData: async (id: number) => {
    return await request.delete({ url: `/agriculture/topic-data/delete?id=` + id })
  },

  // 导出主题订阅 Excel
  exportTopicData: async (params) => {
    return await request.download({ url: `/agriculture/topic-data/export-excel`, params })
  },

  // 订阅主题
  subscribeTopic: async (data: TopicDataVO) => {
    return await request.post({ url: `/agriculture/topic-data/subscribeTopic`, data })
  },

  // 退阅主题
  unsubscribeTopic: async (data: TopicDataVO) => {
    return await request.post({ url: `/agriculture/topic-data/unsubscribe`, data })
  },

  // 全部订阅
  subscribeAll: async () => {
    return await request.put({ url: `/agriculture/topic-data/subscribeAll`})
  },

  // 全部退订
  unsubscribeAll: async () => {
    return await request.put({ url: `/agriculture/topic-data/unsubscribeAll`})
  },
}
