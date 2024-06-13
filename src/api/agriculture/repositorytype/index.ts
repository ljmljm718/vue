import request from '@/config/axios'

// 知识库分类 VO
export interface RepositoryTypeVO {
  id: string // 分类ID
  repositoryName: string // 知识库分类名称
  parentId: string // 上级ID
}

// 知识库分类 API
export const RepositoryTypeApi = {
  // 查询知识库分类分页
  getRepositoryTypePage: async (params: any) => {
    return await request.get({ url: `/agriculture/repository-type/page`, params })
  },

  // 查询知识库分类详情
  getRepositoryType: async (id: number) => {
    return await request.get({ url: `/agriculture/repository-type/get?id=` + id })
  },

  // 新增知识库分类
  createRepositoryType: async (data: RepositoryTypeVO) => {
    return await request.post({ url: `/agriculture/repository-type/create`, data })
  },

  // 修改知识库分类
  updateRepositoryType: async (data: RepositoryTypeVO) => {
    return await request.put({ url: `/agriculture/repository-type/update`, data })
  },

  // 删除知识库分类
  deleteRepositoryType: async (id: number) => {
    return await request.delete({ url: `/agriculture/repository-type/delete?id=` + id })
  },

  // 导出知识库分类 Excel
  exportRepositoryType: async (params) => {
    return await request.download({ url: `/agriculture/repository-type/export-excel`, params })
  },

  // 查询知识库分类详情
  getAllRepositoryType: async () => {
    return await request.get({ url: `/agriculture/repository-type/getAll` })
  }
}
