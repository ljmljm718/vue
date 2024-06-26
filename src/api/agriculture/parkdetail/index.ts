import request from '@/config/axios'

// 地块基本信息 VO
export interface ParkDetailVO {
  id: string // 主键
  parkId: string // 主表
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
  qrImg: undefined
  quantity: string // 数量
  adoptionType: string // 认养模式
}

// 地块基本信息 API
export const ParkDetailApi = {
  // 查询地块基本信息分页
  getParkDetailPage: async (params: any) => {
    return await request.get({ url: `/agriculture/park-detail/page`, params })
  },

  // 查询地块基本信息详情
  getParkDetail: async (id: number) => {
    return await request.get({ url: `/agriculture/park-detail/get?id=` + id })
  },

  // 新增地块基本信息
  createParkDetail: async (data: ParkDetailVO) => {
    return await request.post({ url: `/agriculture/park-detail/create`, data })
  },

  // 修改地块基本信息
  updateParkDetail: async (data: ParkDetailVO) => {
    return await request.put({ url: `/agriculture/park-detail/update`, data })
  },

  // 删除地块基本信息
  deleteParkDetail: async (id: number) => {
    return await request.delete({ url: `/agriculture/park-detail/delete?id=` + id })
  },

  // 导出地块基本信息 Excel
  exportParkDetail: async (params) => {
    return await request.download({ url: `/agriculture/park-detail/export-excel`, params })
  }
}
