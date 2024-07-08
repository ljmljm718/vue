import request from '@/config/axios'

// 知识库 VO
export interface RepositoryInfoVO {
  id: string // 分类ID
  repositoryName: string // 知识库分类名称
  repositoryId: string // 分类ID
  repositoryTitle: string // 知识库标题
  repositoryType: string // 类型
  repositoryContent: string // 内容
  attachmentFile: string // 附件
  attachmentImg:string
  repositoryLabel: string // 标签
  writer: string // 作者
  browseNum: number // 浏览量
  repositoryStatus: string // 状态
  releaseTime: Date // 发布时间
}

// 知识库 API
export const RepositoryInfoApi = {
  // 查询知识库分页
  getRepositoryInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/repository-info/page`, params })
  },

  // 查询知识库详情
  getRepositoryInfo: async (id: number) => {
    return await request.get({ url: `/agriculture/repository-info/get?id=` + id })
  },

  // 新增知识库
  createRepositoryInfo: async (data: RepositoryInfoVO) => {
    return await request.post({ url: `/agriculture/repository-info/create`, data })
  },

  // 修改知识库
  updateRepositoryInfo: async (data: RepositoryInfoVO) => {
    return await request.put({ url: `/agriculture/repository-info/update`, data })
  },

  // 删除知识库
  deleteRepositoryInfo: async (id: number) => {
    return await request.delete({ url: `/agriculture/repository-info/delete?id=` + id })
  },

  // 导出知识库 Excel
  exportRepositoryInfo: async (params) => {
    return await request.download({ url: `/agriculture/repository-info/export-excel`, params })
  },

  // 修改知识库发布状态及时间
  updateRepositoryStatus: async (id: number) => {
    return await request.get({ url: `/agriculture/repository-info/updateRepositoryStatus?id=` + id })
  },

  // 查询知识库详情
  getRepositoryInfoDetail: async (id: number) => {
    return await request.get({ url: `/agriculture/repository-info/getRepositoryInfoDetail?id=` + id })
  },
}
