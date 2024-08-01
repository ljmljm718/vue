import request from '@/config/axios'

// 指标要素范围 VO
export interface ModelIndicatorElementRangeVO {
  id: string // 主键
  indicatorElementId: string // 指标要素id
  lowLimit: string // 下限
  highLimit: string // 上限
  unit: string // 单位
  healthRatio: string // 健康比例
  healthLevel: string // 健康等级
  indicatorResult: string // 指标结果
  sortBy: string // 排序
}

// 指标要素范围 API
export const ModelIndicatorElementRangeApi = {
  // 查询指标要素范围分页
  getModelIndicatorElementRangePage: async (params: any) => {
    return await request.get({ url: `/agriculture/model-indicator-element-range/page`, params })
  },

  // 查询指标要素范围详情
  getModelIndicatorElementRange: async (id: number) => {
    return await request.get({ url: `/agriculture/model-indicator-element-range/get?id=` + id })
  },

  // 新增指标要素范围
  createModelIndicatorElementRange: async (data: ModelIndicatorElementRangeVO) => {
    return await request.post({ url: `/agriculture/model-indicator-element-range/create`, data })
  },

  // 修改指标要素范围
  updateModelIndicatorElementRange: async (data: ModelIndicatorElementRangeVO) => {
    return await request.put({ url: `/agriculture/model-indicator-element-range/update`, data })
  },

  // 删除指标要素范围
  deleteModelIndicatorElementRange: async (id: number) => {
    return await request.delete({ url: `/agriculture/model-indicator-element-range/delete?id=` + id })
  },

  // 导出指标要素范围 Excel
  exportModelIndicatorElementRange: async (params) => {
    return await request.download({ url: `/agriculture/model-indicator-element-range/export-excel`, params })
  },
}
