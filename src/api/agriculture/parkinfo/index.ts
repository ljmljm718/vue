import request from '@/config/axios'

// 基地基本信息 VO
export interface ParkInfoVO {
  id: string // 主键
  code: string // 编号
  name: string // 名称
  type: string // 类型
  altitude: string // 海拔
  latitude: string // 纬度
  longitude: string // 经度
  address: string // 通讯地址
  contact: string // 联系人
  tel: string // 联系电话
  area: string // 面积
  remark: string // 备注
  deptId: number // 部门编号
  userId: number // 用户编号
}

// 基地基本信息 API
export const ParkInfoApi = {
  // 查询基地基本信息分页
  getParkInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/park-info/page`, params })
  },

  // 查询基地基本信息详情
  getParkInfo: async (id: number) => {
    return await request.get({ url: `/agriculture/park-info/get?id=` + id })
  },

  // 新增基地基本信息
  createParkInfo: async (data: ParkInfoVO) => {
    return await request.post({ url: `/agriculture/park-info/create`, data })
  },

  // 修改基地基本信息
  updateParkInfo: async (data: ParkInfoVO) => {
    return await request.put({ url: `/agriculture/park-info/update`, data })
  },

  // 删除基地基本信息
  deleteParkInfo: async (id: number) => {
    return await request.delete({ url: `/agriculture/park-info/delete?id=` + id })
  },

  // 导出基地基本信息 Excel
  exportParkInfo: async (params) => {
    return await request.download({ url: `/agriculture/park-info/export-excel`, params })
  },

// ==================== 子表（地块基本信息） ====================

  // 获得地块基本信息列表
  getParkDetailListByParkId: async (parkId) => {
    return await request.get({ url: `/agriculture/park-info/park-detail/list-by-park-id?parkId=` + parkId })
  }
}