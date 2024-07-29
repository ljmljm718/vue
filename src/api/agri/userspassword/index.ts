import request from '@/config/axios'

// 登录用户密码 VO
export interface UsersPasswordVO {
  id: string // 主键
  tenant: string // 租户名
  users: string // 用户名
  password: string // 密码
}

// 登录用户密码 API
export const UsersPasswordApi = {
  // 查询登录用户密码分页
  getUsersPasswordPage: async (params: any) => {
    return await request.get({ url: `/agri/users-password/page`, params })
  },

  // 查询登录用户密码详情
  getUsersPassword: async (id: number) => {
    return await request.get({ url: `/agri/users-password/get?id=` + id })
  },

  // 新增登录用户密码
  createUsersPassword: async (data: UsersPasswordVO) => {
    return await request.post({ url: `/agri/users-password/create`, data })
  },

  // 修改登录用户密码
  updateUsersPassword: async (data: UsersPasswordVO) => {
    return await request.put({ url: `/agri/users-password/update`, data })
  },

  // 删除登录用户密码
  deleteUsersPassword: async (id: number) => {
    return await request.delete({ url: `/agri/users-password/delete?id=` + id })
  },

  // 导出登录用户密码 Excel
  exportUsersPassword: async (params) => {
    return await request.download({ url: `/agri/users-password/export-excel`, params })
  },
}
