import request from '@/config/axios'

// 统计中间 VO
export interface StatisticalIntermediateTableVO {
  id: string // id
  landBlockId: string // 地块ID
  crop: string // 作物
  date: Date // 日期
  category: string // 类别
  name: string // 名称
  quantity: string // 数量
  unit: string // 单位
}

// 统计中间 API
export const StatisticalIntermediateTableApi = {
  // 查询统计中间分页
  getStatisticalIntermediateTablePage: async (params: any) => {
    return await request.get({ url: `/agriculture/statistical-intermediate-table/page`, params })
  },

  // 查询统计中间详情
  getStatisticalIntermediateTable: async (id: number) => {
    return await request.get({ url: `/agriculture/statistical-intermediate-table/get?id=` + id })
  },

  // 新增统计中间
  createStatisticalIntermediateTable: async (data: StatisticalIntermediateTableVO) => {
    return await request.post({ url: `/agriculture/statistical-intermediate-table/create`, data })
  },

  // 修改统计中间
  updateStatisticalIntermediateTable: async (data: StatisticalIntermediateTableVO) => {
    return await request.put({ url: `/agriculture/statistical-intermediate-table/update`, data })
  },

  // 删除统计中间
  deleteStatisticalIntermediateTable: async (id: number) => {
    return await request.delete({ url: `/agriculture/statistical-intermediate-table/delete?id=` + id })
  },

  // 导出统计中间 Excel
  exportStatisticalIntermediateTable: async (params) => {
    return await request.download({ url: `/agriculture/statistical-intermediate-table/export-excel`, params })
  }
}