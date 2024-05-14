import request from '@/config/axios'

// 特色产品 VO
export interface VillageProductVO {
  id: string // 主键
  product: string // 产品名称
  parkId: string // 所属基地id
  park: string // 所属基地
  parkDetailId: string // 产品码（所属地块id）
  parkDetail: string // 所属地块
  photo: string // 图片
  years: string // 产品年份
  inventory: string // 库存
  specifications: string // 规格
  remark: string // 备注
}

// 特色产品 API
export const VillageProductApi = {
  // 查询特色产品分页
  getVillageProductPage: async (params: any) => {
    return await request.get({ url: `/digital/village-product/page`, params })
  },

  // 查询特色产品详情
  getVillageProduct: async (id: number) => {
    return await request.get({ url: `/digital/village-product/get?id=` + id })
  },

  // 新增特色产品
  createVillageProduct: async (data: VillageProductVO) => {
    return await request.post({ url: `/digital/village-product/create`, data })
  },

  // 修改特色产品
  updateVillageProduct: async (data: VillageProductVO) => {
    return await request.put({ url: `/digital/village-product/update`, data })
  },

  // 删除特色产品
  deleteVillageProduct: async (id: number) => {
    return await request.delete({ url: `/digital/village-product/delete?id=` + id })
  },

  // 导出特色产品 Excel
  exportVillageProduct: async (params) => {
    return await request.download({ url: `/digital/village-product/export-excel`, params })
  },
}
