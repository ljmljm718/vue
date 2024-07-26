import request from '@/config/axios'

// 生长周期子表 VO
export interface CropGrowthSubVO {
  id: string // 主键
  cropCode: string // 生长期id
  itemName: string // 事项名称
  itemContent: string // 事项内容
  remark1: string // 备注1
  remark: string // 备注2
  belongPark: string // 所属基地
  belongPlot: string // 所属地块
  startTime: Date // 开始时间
  endTime: Date // 结束时间
  cropId: string // 作物关联id
  envCondition: string // 环境条件
  growSite: string // 生长地点
  parkName: string // 基地名称
  plotName: string // 地块名称
}

// 生长周期子表 API
export const CropGrowthSubApi = {
  // 查询生长周期子表分页
  getCropGrowthSubPage: async (params: any) => {
    return await request.get({ url: `/agriculture/crop-growth-sub/page`, params })
  },

  // 查询生长周期子表详情
  getCropGrowthSub: async (id: number) => {
    return await request.get({ url: `/agriculture/crop-growth-sub/get?id=` + id })
  },

  // 新增生长周期子表
  createCropGrowthSub: async (data: CropGrowthSubVO) => {
    return await request.post({ url: `/agriculture/crop-growth-sub/create`, data })
  },

  // 修改生长周期子表
  updateCropGrowthSub: async (data: CropGrowthSubVO) => {
    return await request.put({ url: `/agriculture/crop-growth-sub/update`, data })
  },

  // 删除生长周期子表
  deleteCropGrowthSub: async (id: number) => {
    return await request.delete({ url: `/agriculture/crop-growth-sub/delete?id=` + id })
  },

  // 导出生长周期子表 Excel
  exportCropGrowthSub: async (params) => {
    return await request.download({ url: `/agriculture/crop-growth-sub/export-excel`, params })
  }
}