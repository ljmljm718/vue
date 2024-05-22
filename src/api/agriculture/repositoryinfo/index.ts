import request from '@/config/axios'

// 助农知识库信息表 VO
export interface RepositoryInfoVO {
  id: string // 主键ID
  repositoryTitle: string // 标题
  repositoryType: string // 知识库分类名称
  repositoryLabel: string // 知识库标签
  writer: string // 作者
  synopsis: string // 简介
  repositoryContent: string // 内容
  attachmentImg: string // 封面图片
  attachmentFile: string // 附件文件
  browseNum: number // 浏览量
}

// 助农知识库信息表 API
export const RepositoryInfoApi = {
  // 查询助农知识库信息表分页
  getRepositoryInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/repository-info/page`, params })
  },

  // 查询助农知识库信息表详情
  getRepositoryInfo: async (id: number) => {
    return await request.get({ url: `/agriculture/repository-info/get?id=` + id })
  },

  // 新增助农知识库信息表
  createRepositoryInfo: async (data: RepositoryInfoVO) => {
    return await request.post({ url: `/agriculture/repository-info/create`, data })
  },

  // 修改助农知识库信息表
  updateRepositoryInfo: async (data: RepositoryInfoVO) => {
    return await request.put({ url: `/agriculture/repository-info/update`, data })
  },

  // 删除助农知识库信息表
  deleteRepositoryInfo: async (id: number) => {
    return await request.delete({ url: `/agriculture/repository-info/delete?id=` + id })
  },

  // 导出助农知识库信息表 Excel
  exportRepositoryInfo: async (params) => {
    return await request.download({ url: `/agriculture/repository-info/export-excel`, params })
  },
}