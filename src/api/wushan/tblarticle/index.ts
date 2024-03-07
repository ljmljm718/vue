import request from '@/config/axios'

// 文章信息 VO
export interface TblArticleVO {
  articleId: string // 文章id
  articleTitle: string // 文章标题
  articleCategory: string // 文章类别
  articleTag: string // 文章标签
  articleAuthor: string // 作者
  articleContent: string // 文章内容
  publishTime: Date // 发布时间
  articleReadQuantity: number // 浏览量
  articleStatus: string // 文章状态
  articleImage: string // 文章略缩图
  remark: string // 备注
  deptId: string // 所属系统
}

// 文章信息 API
export const TblArticleApi = {
  // 查询文章信息分页
  getTblArticlePage: async (params: any) => {
    return await request.get({ url: `/wushan/tbl-article/page`, params })
  },

  // 查询文章信息详情
  getTblArticle: async (id: number) => {
    return await request.get({ url: `/wushan/tbl-article/get?id=` + id })
  },

  // 新增文章信息
  createTblArticle: async (data: TblArticleVO) => {
    return await request.post({ url: `/wushan/tbl-article/create`, data })
  },

  // 修改文章信息
  updateTblArticle: async (data: TblArticleVO) => {
    return await request.put({ url: `/wushan/tbl-article/update`, data })
  },

  // 删除文章信息
  deleteTblArticle: async (id: number) => {
    return await request.delete({ url: `/wushan/tbl-article/delete?id=` + id })
  },

  // 导出文章信息 Excel
  exportTblArticle: async (params) => {
    return await request.download({ url: `/wushan/tbl-article/export-excel`, params })
  },
}
