import request from '@/config/axios'

// 鲁渝协作农事定义 VO
export interface FarmDefineVO {
  id: number // id主键
  parentId: number // 父结点id（第一级父结点是0，自关联字段id）
  defineCode: string // 分类编码
  defineName: string // 分类名称
  defineLabel: string // 分类标签，默认和名称一样
  showStatus: number // 是否显示
  defineSort: number // 分类排序
  isLeaf: boolean // 是否叶子
  imgId: string // 图片
  description: string // 描述
}

// 鲁渝协作农事定义 API
export const FarmDefineApi = {
  // 查询鲁渝协作农事定义列表
  getFarmDefineList: async (params) => {
    return await request.get({ url: `/agri/farm-define/list`, params })
  },

  // 查询鲁渝协作农事定义详情
  getFarmDefine: async (id: number) => {
    return await request.get({ url: `/agri/farm-define/get?id=` + id })
  },

  // 新增鲁渝协作农事定义
  createFarmDefine: async (data: FarmDefineVO) => {
    return await request.post({ url: `/agri/farm-define/create`, data })
  },

  // 修改鲁渝协作农事定义
  updateFarmDefine: async (data: FarmDefineVO) => {
    return await request.put({ url: `/agri/farm-define/update`, data })
  },

  // 删除鲁渝协作农事定义
  deleteFarmDefine: async (id: number) => {
    return await request.delete({ url: `/agri/farm-define/delete?id=` + id })
  },

  // 导出鲁渝协作农事定义 Excel
  exportFarmDefine: async (params) => {
    return await request.download({ url: `/agri/farm-define/export-excel`, params })
  },
}
