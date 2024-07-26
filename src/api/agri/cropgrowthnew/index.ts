import request from '@/config/axios'

// 作物生长周期 VO
export interface CropGrowthNewVO {
  id: string // 主键
  cropCode: string // 编号
  cropName: string // 名称
  cropType: string // 品种
  imgId: string // 图片
  growth: string // 生长期
  feature: string // 特点
  remark: string // 备注
  startTime: Date // 开始时间
  endTime: Date // 结束时间
  cropId: string // 作物关联id
  envCondition: string // 环境条件
  growSite: string // 生长地点
  cycle: string // 周期
}

// 作物生长周期 API
export const CropGrowthNewApi = {
  // 查询作物生长周期分页
  getCropGrowthNewPage: async (params: any) => {
    return await request.get({ url: `/agri/crop-growth-new/page`, params })
  },

  // 查询作物生长周期详情
  getCropGrowthNew: async (id: number) => {
    return await request.get({ url: `/agri/crop-growth-new/get?id=` + id })
  },

  // 新增作物生长周期
  createCropGrowthNew: async (data: CropGrowthNewVO) => {
    return await request.post({ url: `/agri/crop-growth-new/create`, data })
  },

  // 修改作物生长周期
  updateCropGrowthNew: async (data: CropGrowthNewVO) => {
    return await request.put({ url: `/agri/crop-growth-new/update`, data })
  },

  // 删除作物生长周期
  deleteCropGrowthNew: async (id: number) => {
    return await request.delete({ url: `/agri/crop-growth-new/delete?id=` + id })
  },

  // 导出作物生长周期 Excel
  exportCropGrowthNew: async (params) => {
    return await request.download({ url: `/agri/crop-growth-new/export-excel`, params })
  },

  // 保存电子围栏
  saveGeofencing: async (data) => {
    return await request.put({ url: `/agriculture/park-info/save-geofencing`, data })
  },
}
