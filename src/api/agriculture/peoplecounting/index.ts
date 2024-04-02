import request from '@/config/axios'

// 旅游人流量统计 VO
export interface PeopleCountingVO {
  id: number // 主键ID
  countDate: Date // 日期
  countPlace: string // 地点
  inPeople: string // 进入人数
  outPeople: string // 离开人数
  stayPeople: string // 净流量
  weather: string // 当日天气
}

// 旅游人流量统计 API
export const PeopleCountingApi = {
  // 查询旅游人流量统计分页
  getPeopleCountingPage: async (params: any) => {
    return await request.get({ url: `/agriculture/people-counting/page`, params })
  },

  // 查询旅游人流量统计详情
  getPeopleCounting: async (id: number) => {
    return await request.get({ url: `/agriculture/people-counting/get?id=` + id })
  },

  // 新增旅游人流量统计
  createPeopleCounting: async (data: PeopleCountingVO) => {
    return await request.post({ url: `/agriculture/people-counting/create`, data })
  },

  // 修改旅游人流量统计
  updatePeopleCounting: async (data: PeopleCountingVO) => {
    return await request.put({ url: `/agriculture/people-counting/update`, data })
  },

  // 删除旅游人流量统计
  deletePeopleCounting: async (id: number) => {
    return await request.delete({ url: `/agriculture/people-counting/delete?id=` + id })
  },

  // 导出旅游人流量统计 Excel
  exportPeopleCounting: async (params) => {
    return await request.download({ url: `/agriculture/people-counting/export-excel`, params })
  },
}