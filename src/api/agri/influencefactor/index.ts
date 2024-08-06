import request from '@/config/axios'

// 影响因子 VO
export interface InfluenceFactorVO {
  id: string // 主键
  factorName: string // 因子名称
  factorType: string // 因子类别
  influence: string // 影响结果
  monitorType: string // 传感器监测类型
  proposal: string // 建议
  remark: string // 备注
}

// 影响因子 API
export const InfluenceFactorApi = {
  // 查询影响因子分页
  getInfluenceFactorPage: async (params: any) => {
    return await request.get({ url: `/agri/influence-factor/page`, params })
  },

  // 查询影响因子详情
  getInfluenceFactor: async (id: number) => {
    return await request.get({ url: `/agri/influence-factor/get?id=` + id })
  },

  // 新增影响因子
  createInfluenceFactor: async (data: InfluenceFactorVO) => {
    return await request.post({ url: `/agri/influence-factor/create`, data })
  },

  // 修改影响因子
  updateInfluenceFactor: async (data: InfluenceFactorVO) => {
    return await request.put({ url: `/agri/influence-factor/update`, data })
  },

  // 删除影响因子
  deleteInfluenceFactor: async (id: number) => {
    return await request.delete({ url: `/agri/influence-factor/delete?id=` + id })
  },

  // 导出影响因子 Excel
  exportInfluenceFactor: async (params) => {
    return await request.download({ url: `/agri/influence-factor/export-excel`, params })
  },
}
