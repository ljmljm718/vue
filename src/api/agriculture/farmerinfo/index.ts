import request from '@/config/axios'

// 农户管理 VO
export interface FarmerInfoVO {
  id: number // 农户ID
  farmerId: string // 农户编码
  farmerName: string // 农户姓名
  sex: number // 性别
  age: string // 年龄
  mobile: string // 手机号码
  coveredLandArea: string // 承包土地面积（亩）
  plantingSpecies: string // 擅长种植种类
  plantingExperience: string // 种植经验（年）
  deptId: number // 部门id
  userId: number // 用户id
}

// 农户管理 API
export const FarmerInfoApi = {
  // 查询农户管理分页
  getFarmerInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/farmer-info/page`, params })
  },

  // 查询农户管理详情
  getFarmerInfo: async (id: number) => {
    return await request.get({ url: `/agriculture/farmer-info/get?id=` + id })
  },

  // 新增农户管理
  createFarmerInfo: async (data: FarmerInfoVO) => {
    return await request.post({ url: `/agriculture/farmer-info/create`, data })
  },

  // 修改农户管理
  updateFarmerInfo: async (data: FarmerInfoVO) => {
    return await request.put({ url: `/agriculture/farmer-info/update`, data })
  },

  // 删除农户管理
  deleteFarmerInfo: async (id: number) => {
    return await request.delete({ url: `/agriculture/farmer-info/delete?id=` + id })
  },

  // 导出农户管理 Excel
  exportFarmerInfo: async (params) => {
    return await request.download({ url: `/agriculture/farmer-info/export-excel`, params })
  },
}