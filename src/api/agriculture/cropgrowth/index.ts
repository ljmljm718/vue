import request from '@/config/axios'

// 作物生长期管理 VO
export interface CropGrowthVO {
  id: string // 主键
  cropId: string //作物id
  cropCode: string // 编号
  cropName: string // 名称
  cropType: string // 品种
  envCondition:string
  growSite: string
  imgId: string // 图片
  growth: string // 生长期
  feature: string // 特点
  remark: string // 备注
  belongPark: string // 所属地块
  belongPlot: string // 所属园区
  startTime: Date // 开始时间
  endTime: Date // 结束时间
  parkName:string // 基地名称
  plotName:string // 地块名称
}

// 作物生长期管理 API
export const CropGrowthApi = {
  // 查询作物生长期管理分页
  getCropGrowthPage: async (params: any) => {
    return await request.get({ url: `/agri/crop-growth/page`, params })
  },

  // 查询作物生长期管理详情
  getCropGrowth: async (id: number) => {
    return await request.get({ url: `/agri/crop-growth/get?id=` + id })
  },

  // 新增作物生长期管理
  createCropGrowth: async (data: CropGrowthVO) => {
    return await request.post({ url: `/agri/crop-growth/create`, data })
  },

  // 修改作物生长期管理
  updateCropGrowth: async (data: CropGrowthVO) => {
    return await request.put({ url: `/agri/crop-growth/update`, data })
  },

  // 删除作物生长期管理
  deleteCropGrowth: async (id: number) => {
    return await request.delete({ url: `/agri/crop-growth/delete?id=` + id })
  },

  // 导出作物生长期管理 Excel
  exportCropGrowth: async (params) => {
    return await request.download({ url: `/agri/crop-growth/export-excel`, params })
  },
}
