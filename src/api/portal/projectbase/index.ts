import request from '@/config/axios'

// 门户项目基础信息 VO
export interface ProjectBaseVO {
  code: string // 项目编码
  name: string // 项目名称
  category: number // 项目分类
  pic: string // 图片
  description: string // 描述
  status: number // 状态
  sort: number // 排序
  remark: string // 备注
}

// 门户项目基础信息 API
export const ProjectBaseApi = {
  // 查询门户项目基础信息分页
  getProjectBasePage: async (params: any) => {
    return await request.get({ url: `/portal/project-base/page`, params })
  },

  // 查询门户项目基础信息详情
  getProjectBase: async (id: number) => {
    return await request.get({ url: `/portal/project-base/get?id=` + id })
  },

  // 新增门户项目基础信息
  createProjectBase: async (data: ProjectBaseVO) => {
    return await request.post({ url: `/portal/project-base/create`, data })
  },

  // 修改门户项目基础信息
  updateProjectBase: async (data: ProjectBaseVO) => {
    return await request.put({ url: `/portal/project-base/update`, data })
  },

  // 删除门户项目基础信息
  deleteProjectBase: async (id: number) => {
    return await request.delete({ url: `/portal/project-base/delete?id=` + id })
  },

  // 导出门户项目基础信息 Excel
  exportProjectBase: async (params) => {
    return await request.download({ url: `/portal/project-base/export-excel`, params })
  },

// ==================== 子表（门户项目服务） ====================

  // 获得门户项目服务分页
  getProjectServicePage: async (params) => {
    return await request.get({ url: `/portal/project-base/project-service/page`, params })
  },
  // 新增门户项目服务
  createProjectService: async (data) => {
    return await request.post({ url: `/portal/project-base/project-service/create`, data })
  },

  // 修改门户项目服务
  updateProjectService: async (data) => {
    return await request.put({ url: `/portal/project-base/project-service/update`, data })
  },

  // 删除门户项目服务
  deleteProjectService: async (id: number) => {
    return await request.delete({ url: `/portal/project-base/project-service/delete?id=` + id })
  },

  // 获得门户项目服务
  getProjectService: async (id: number) => {
    return await request.get({ url: `/portal/project-base/project-service/get?id=` + id })
  },
}