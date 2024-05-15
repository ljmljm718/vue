import request from '@/config/axios'

// 鸭舍管理 VO
export interface DuckHouseManagementVO {
  id: string // 主键
  name: string // 名称
  duckFarmCode: string // 编号
  category: string // 分类
  location: string // 位置
  duckCount: string // 养鸭数量
  duckFarmImage: string // 图片
  constructionTime: string // 建设时间
  area: string // 面积
  belongingVillager: string // 所属村民
  responsiblePerson: string // 负责人
  introduction: string // 介绍
  reserveOne: string // 备用一
  reserveTwo: string // 备用二
  reserveThree: string // 备用三
}

// 鸭舍管理 API
export const DuckHouseManagementApi = {
  // 查询鸭舍管理分页
  getDuckHouseManagementPage: async (params: any) => {
    return await request.get({ url: `/agri/duck-house-management/page`, params })
  },

  // 查询鸭舍管理详情
  getDuckHouseManagement: async (id: number) => {
    return await request.get({ url: `/agri/duck-house-management/get?id=` + id })
  },

  // 新增鸭舍管理
  createDuckHouseManagement: async (data: DuckHouseManagementVO) => {
    return await request.post({ url: `/agri/duck-house-management/create`, data })
  },

  // 修改鸭舍管理
  updateDuckHouseManagement: async (data: DuckHouseManagementVO) => {
    return await request.put({ url: `/agri/duck-house-management/update`, data })
  },

  // 删除鸭舍管理
  deleteDuckHouseManagement: async (id: number) => {
    return await request.delete({ url: `/agri/duck-house-management/delete?id=` + id })
  },

  // 导出鸭舍管理 Excel
  exportDuckHouseManagement: async (params) => {
    return await request.download({ url: `/agri/duck-house-management/export-excel`, params })
  },
}