import request from '@/config/axios'

// 指标要素 VO
export interface ModelIndicatorElementVO {
  id: string // 主键（要素编号）
  indicatorId: string // 指标id
  elementName: string // 要素名称
  weight: string // 权重
  indicatorDescription: string // 指标说明
  bindDevice: string // 绑定设备
  status: string // 状态
  implementationClass: string // 实现类
}

// 指标要素 API
export const ModelIndicatorElementApi = {
  // 查询指标要素分页
  getModelIndicatorElementPage: async (params: any) => {
    return await request.get({ url: `/agriculture/model-indicator-element/page`, params })
  },

  // 查询指标要素详情
  getModelIndicatorElement: async (id: number) => {
    return await request.get({ url: `/agriculture/model-indicator-element/get?id=` + id })
  },

  // 新增指标要素
  createModelIndicatorElement: async (data: ModelIndicatorElementVO) => {
    return await request.post({ url: `/agriculture/model-indicator-element/create`, data })
  },

  // 修改指标要素
  updateModelIndicatorElement: async (data: ModelIndicatorElementVO) => {
    return await request.put({ url: `/agriculture/model-indicator-element/update`, data })
  },

  // 删除指标要素
  deleteModelIndicatorElement: async (id: number) => {
    return await request.delete({ url: `/agriculture/model-indicator-element/delete?id=` + id })
  },

  // 导出指标要素 Excel
  exportModelIndicatorElement: async (params) => {
    return await request.download({ url: `/agriculture/model-indicator-element/export-excel`, params })
  },

  // 修改指标要素状态
  updateModelIndicatorElementStatus: async (id: any, status: any) => {
    const data = {
      id,
      status
    }
    return await request.put({ url: `/agriculture/model-indicator-element/updateStatus`, data })
  },

// ==================== 子表（指标要素范围） ====================

  // 获得指标要素范围列表
  getModelIndicatorElementRangeListByIndicatorElementId: async (indicatorElementId) => {
    return await request.get({ url: `/agriculture/model-indicator-element/model-indicator-element-range/list-by-indicator-element-id?indicatorElementId=` + indicatorElementId })
  },
}
