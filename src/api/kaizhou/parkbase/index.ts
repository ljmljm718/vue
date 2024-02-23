import request from '@/config/axios'

// 园区/地块基本信息 VO
export interface ParkBaseVO {
  id: string // 主键
  code: string // 编号
  name: string // 名称
  grade: string // 级别
  type: string // 类型
  altitude: string // 海拔
  latitude: string // 纬度
  longitude: string // 经度
  address: string // 通讯地址
  contact: string // 联系人
  tel: string // 联系电话
  area: string // 面积
  parentId: string // 父节点id
  remark: string // 备注
}

// 园区/地块基本信息 API
export const ParkBaseApi = {
  // 查询园区/地块基本信息分页
  getParkBasePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/park-base/page`, params })
  },

  // 查询园区/地块基本信息详情
  getParkBase: async (id: string) => {
    return await request.get({ url: `/kaizhou/park-base/get?id=` + id })
  },

  // 新增园区/地块基本信息
  createParkBase: async (data: ParkBaseVO) => {
    return await request.post({ url: `/kaizhou/park-base/create`, data })
  },

  // 修改园区/地块基本信息
  updateParkBase: async (data: ParkBaseVO) => {
    return await request.put({ url: `/kaizhou/park-base/update`, data })
  },

  // 删除园区/地块基本信息
  deleteParkBase: async (id: string) => {
    return await request.delete({ url: `/kaizhou/park-base/delete?id=` + id })
  },

  // 导出园区/地块基本信息 Excel
  exportParkBase: async (params) => {
    return await request.download({ url: `/kaizhou/park-base/export-excel`, params })
  },
}
