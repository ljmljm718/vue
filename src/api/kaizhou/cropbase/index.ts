import request from '@/config/axios'

// 作物管理 VO
export interface CropBaseVO {
  id: string // 主键
  cropName: string // 名称
  cropType: string // 品种
  imgId: string // 图片
  remark: string // 备注
  cropCode: string // 编号
  cropDesc: string // 描述
}

// 作物管理 API
export const CropBaseApi = {
  // 查询作物管理分页
  getCropBasePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/crop-base/page`, params })
  },

  // 查询作物管理详情
  getCropBase: async (id: number) => {
    return await request.get({ url: `/kaizhou/crop-base/get?id=` + id })
  },

  // 新增作物管理
  createCropBase: async (data: CropBaseVO) => {
    return await request.post({ url: `/kaizhou/crop-base/create`, data })
  },

  // 修改作物管理
  updateCropBase: async (data: CropBaseVO) => {
    return await request.put({ url: `/kaizhou/crop-base/update`, data })
  },

  // 删除作物管理
  deleteCropBase: async (id: number) => {
    return await request.delete({ url: `/kaizhou/crop-base/delete?id=` + id })
  },

  // 导出作物管理 Excel
  exportCropBase: async (params) => {
    return await request.download({ url: `/kaizhou/crop-base/export-excel`, params })
  },
}