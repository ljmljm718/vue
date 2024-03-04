import request from '@/config/axios'

// 项目分类 VO
export interface ProjectCategoryVO {
  code: string // 分类编码
  name: string // 分类名称
  label: string // 分类标签
  status: number // 是否显示
  id: number // id主键
  parentId: number // 父结点i
  sort: number // 分类排序
}

// 项目分类 API
export const ProjectCategoryApi = {
  // 查询项目分类列表
  getProjectCategoryList: async (params) => {
    return await request.get({ url: `/portal/project-category/list`, params })
  },

  // 查询项目分类详情
  getProjectCategory: async (id: number) => {
    return await request.get({ url: `/portal/project-category/get?id=` + id })
  },

  // 新增项目分类
  createProjectCategory: async (data: ProjectCategoryVO) => {
    return await request.post({ url: `/portal/project-category/create`, data })
  },

  // 修改项目分类
  updateProjectCategory: async (data: ProjectCategoryVO) => {
    return await request.put({ url: `/portal/project-category/update`, data })
  },

  // 删除项目分类
  deleteProjectCategory: async (id: number) => {
    return await request.delete({ url: `/portal/project-category/delete?id=` + id })
  },

  // 导出项目分类 Excel
  exportProjectCategory: async (params) => {
    return await request.download({ url: `/portal/project-category/export-excel`, params })
  },
}