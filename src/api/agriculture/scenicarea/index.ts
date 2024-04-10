import request from '@/config/axios'

// 景区管理 VO
export interface ScenicAreaVO {
  id: number // id
  scenicName: string // 景区名称
  lon: string // 经度
  lat: string // 纬度
  location: string // 位置
  starLevel: string // 星级
  detail: string // 描述
  img: string // 图片
}

// 景区管理 API
export const ScenicAreaApi = {
  // 查询景区管理分页
  getScenicAreaPage: async (params: any) => {
    return await request.get({ url: `/agriculture/scenic-area/page`, params })
  },

  // 查询景区管理详情
  getScenicArea: async (id: number) => {
    return await request.get({ url: `/agriculture/scenic-area/get?id=` + id })
  },

  // 新增景区管理
  createScenicArea: async (data: ScenicAreaVO) => {
    return await request.post({ url: `/agriculture/scenic-area/create`, data })
  },

  // 修改景区管理
  updateScenicArea: async (data: ScenicAreaVO) => {
    return await request.put({ url: `/agriculture/scenic-area/update`, data })
  },

  // 删除景区管理
  deleteScenicArea: async (id: number) => {
    return await request.delete({ url: `/agriculture/scenic-area/delete?id=` + id })
  },

  // 导出景区管理 Excel
  exportScenicArea: async (params) => {
    return await request.download({ url: `/agriculture/scenic-area/export-excel`, params })
  },
}
