import request from '@/config/axios'

// 基地分类 VO
export interface ParkCategoryVO {
  categoryName: string // 分类名称
  categoryCode: string // 分类编码
  categoryLabel: string // 分类标签
  description: string // 描述
  id: string // 主键
  showStatus: number // 是否显示
  categorySort: number // 分类排序
}

// 基地分类 API
export const ParkCategoryApi = {
  // 查询基地分类分页
  getParkCategoryPage: async (params: any) => {
    return await request.get({ url: `/agriculture/park-category/page`, params })
  },

  // 查询基地分类详情
  getParkCategory: async (id: number) => {
    return await request.get({ url: `/agriculture/park-category/get?id=` + id })
  },

  // 新增基地分类
  createParkCategory: async (data: ParkCategoryVO) => {
    return await request.post({ url: `/agriculture/park-category/create`, data })
  },

  // 修改基地分类
  updateParkCategory: async (data: ParkCategoryVO) => {
    return await request.put({ url: `/agriculture/park-category/update`, data })
  },

  // 删除基地分类
  deleteParkCategory: async (id: number) => {
    return await request.delete({ url: `/agriculture/park-category/delete?id=` + id })
  },

  // 导出基地分类 Excel
  exportParkCategory: async (params) => {
    return await request.download({ url: `/agriculture/park-category/export-excel`, params })
  },

  // 查询全部基地分类
  getAllParkCategory: async () => {
    return await request.get({ url: `/agriculture/park-category/getAllParkCategory`})
  },

}
