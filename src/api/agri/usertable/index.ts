import request from '@/config/axios'

// 数农门户 VO
export interface UserTableVO {
  id: string // 主键
  years: string // 年份
  county: string // 区县
  village: string // 示范村
  city: string // 帮扶城市
  form: string // 产业类别
  industry: string // 产业
  bigscreen: string // 大屏地址
  park: string // 基地园区
  product: string // 特色品牌
  yesno: string // 是否帮扶地域
}

// 数农门户 API
export const UserTableApi = {
  // 查询数农门户分页
  getUserTablePage: async (params: any) => {
    return await request.get({ url: `/agri/user-table/page`, params })
  },

  // 查询数农门户详情
  getUserTable: async (id: number) => {
    return await request.get({ url: `/agri/user-table/get?id=` + id })
  },

  // 新增数农门户
  createUserTable: async (data: UserTableVO) => {
    return await request.post({ url: `/agri/user-table/create`, data })
  },

  // 修改数农门户
  updateUserTable: async (data: UserTableVO) => {
    return await request.put({ url: `/agri/user-table/update`, data })
  },

  // 删除数农门户
  deleteUserTable: async (id: number) => {
    return await request.delete({ url: `/agri/user-table/delete?id=` + id })
  },

  // 导出数农门户 Excel
  exportUserTable: async (params) => {
    return await request.download({ url: `/agri/user-table/export-excel`, params })
  },
}
