import request from '@/config/axios'

// 产品流通 VO
export interface VillageProductCirculationVO {
  id: string // 主键
  product: string // 产品名称
  customer: string // 客户名称
  unitPrice: string // 单价
  quantity: string // 数量
  totalPrice: string // 总价
  times: string // 时间
  remark: string // 备注
  productId: string // 产品id
  salesLocation: string // 销售地
  productSpecifications: string // 产品规格
  provinceCode: string // 省份Code
  provinceName: string // 省份名称
  cityCode: string // 市区code
  cityName: string // 市区名称
  countiesCode: string // 县区Code
  countiesName: string // 县区名称
}

// 产品流通 API
export const VillageProductCirculationApi = {
  // 查询产品流通分页
  getVillageProductCirculationPage: async (params: any) => {
    return await request.get({url: `/digital/village-product-circulation/page`, params})
  },

  // 查询产品流通详情
  getVillageProductCirculation: async (id: number) => {
    return await request.get({url: `/digital/village-product-circulation/get?id=` + id})
  },

  // 新增产品流通
  createVillageProductCirculation: async (data: VillageProductCirculationVO) => {
    return await request.post({url: `/digital/village-product-circulation/create`, data})
  },

  // 修改产品流通
  updateVillageProductCirculation: async (data: VillageProductCirculationVO) => {
    return await request.put({url: `/digital/village-product-circulation/update`, data})
  },

  // 删除产品流通
  deleteVillageProductCirculation: async (id: number) => {
    return await request.delete({url: `/digital/village-product-circulation/delete?id=` + id})
  },

  // 导出产品流通 Excel
  exportVillageProductCirculation: async (params) => {
    return await request.download({
      url: `/digital/village-product-circulation/export-excel`,
      params
    })
  },
}
