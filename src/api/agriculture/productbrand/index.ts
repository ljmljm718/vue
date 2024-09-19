import request from '@/config/axios'

// 产品品牌 VO
export interface ProductBrandVO {
  id: string // 主键
  productBrand: string // 品牌名
  belongCategoryId: string // 品类id
  belongCategory: string // 品类
  belongVarietyId: string // 品种id
  belongVariety: string // 品种
  brandLogo: string // 品牌logo
  brandDetail: string // 品牌介绍
  usedStatus: number // 启用状态
  remark: string // 备注
}

// 产品品牌 API
export const ProductBrandApi = {
  // 查询产品品牌分页
  getProductBrandPage: async (params: any) => {
    return await request.get({ url: `/agriculture/product-brand/page`, params })
  },

  // 查询产品品牌详情
  getProductBrand: async (id:any) => {
    return await request.get({ url: `/agriculture/product-brand/get?id=` + id })
  },

  // 新增产品品牌
  createProductBrand: async (data: ProductBrandVO) => {
    return await request.post({ url: `/agriculture/product-brand/create`, data })
  },

  // 修改产品品牌
  updateProductBrand: async (data: ProductBrandVO) => {
    return await request.put({ url: `/agriculture/product-brand/update`, data })
  },

  // 删除产品品牌
  deleteProductBrand: async (id: any) => {
    return await request.delete({ url: `/agriculture/product-brand/delete?id=` + id })
  },

  // 导出产品品牌 Excel
  exportProductBrand: async (params) => {
    return await request.download({ url: `/agriculture/product-brand/export-excel`, params })
  },

  // 修改使用状态
  updateProductBrandStatus: async (id: any, usedStatus: any) => {
    const data = {
      id,
      usedStatus
    }
    return await request.put({ url: `/agriculture/product-brand/updateStatus`, data })
  },
}
