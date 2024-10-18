import request from '@/config/axios'
import CacheManager from '@/utils/cacheManager'

// 品类管理 VO
export interface CategoryManagementVO {
  id: string // 主键
  categoryName: string // 品类名称
  categoryCode: string // 品类编码
  phylum: string // 门类
  family: string // 科类
  genus: string // 属类
  images: string // 图片
  briefIntroduction: string // 简介
  remark1: string // 备注1
  remark2: string // 备注2
}

export const allDataCacheManager = new CacheManager()

// 品类管理 API
export const CategoryManagementApi = {
  // 查询品类管理分页
  getCategoryManagementPage: async (params: any) => {
    return await request.get({ url: `/agriculture/category-management/page`, params })
  },

  // 查询未删除的且符合条件的所有品类管理
  getAllCategoryManagement: async (params: any) => {
    return await request.get({ url: `/agriculture/category-management/getAll`, params })
  },

  // 查询品类管理详情
  getCategoryManagement: async (id) => {
    allDataCacheManager.clearCache()
    return await request.get({ url: `/agriculture/category-management/get?id=` + id })
  },

  // 新增品类管理
  createCategoryManagement: async (data: CategoryManagementVO) => {
    allDataCacheManager.clearCache()
    return await request.post({ url: `/agriculture/category-management/create`, data })
  },

  // 修改品类管理
  updateCategoryManagement: async (data: CategoryManagementVO) => {
    allDataCacheManager.clearCache()
    return await request.put({ url: `/agriculture/category-management/update`, data })
  },

  // 删除品类管理
  deleteCategoryManagement: async (id: number) => {
    return await request.delete({ url: `/agriculture/category-management/delete?id=` + id })
  },

  // 导出品类管理 Excel
  exportCategoryManagement: async (params) => {
    return await request.download({ url: `/agriculture/category-management/export-excel`, params })
  },

  // 病虫害监测侧边栏列表
  identificationResultPage: async (params) => {
    return await request.get({ url: `/agriculture/identification-result/page`, params })
  },
}

allDataCacheManager.setFunc(CategoryManagementApi.getAllCategoryManagement)
