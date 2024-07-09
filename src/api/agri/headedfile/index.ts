import request from '@/config/axios'

// 红头文件展示 VO
export interface HeadedFileVO {
  id: string // 主键
  title: string // 标题
  content: string // 内容
  upTime: Date  // 发布时间
  urlAddr: string // 文件地址
}

// 红头文件展示 API
export const HeadedFileApi = {
  // 查询红头文件展示分页
  getHeadedFilePage: async (params: any) => {
    return await request.get({ url: `/agri/headed-file/page`, params })
  },

  // 查询红头文件展示详情
  getHeadedFile: async (id: number) => {
    return await request.get({ url: `/agri/headed-file/get?id=` + id })
  },

  // 新增红头文件展示
  createHeadedFile: async (data: HeadedFileVO) => {
    return await request.post({ url: `/agri/headed-file/create`, data })
  },

  // 修改红头文件展示
  updateHeadedFile: async (data: HeadedFileVO) => {
    return await request.put({ url: `/agri/headed-file/update`, data })
  },

  // 删除红头文件展示
  deleteHeadedFile: async (id: number) => {
    return await request.delete({ url: `/agri/headed-file/delete?id=` + id })
  },

  // 导出红头文件展示 Excel
  exportHeadedFile: async (params) => {
    return await request.download({ url: `/agri/headed-file/export-excel`, params })
  }
}
