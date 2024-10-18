import request from '@/config/axios'

// 识别结果 VO
export interface IdentificationResultVO {
  id: string // id
  mainTableId: string // 主表ID
  name: string // 名称
  quantity: number // 数量
  density: string // 密度
  recognitionTime: Date // 识别时间
  recognitionType: string // 识别类型
  recorder: string // 记录人
}

// 识别结果 API
export const IdentificationResultApi = {
  // 查询识别结果分页
  getIdentificationResultPage: async (params: any) => {
    return await request.get({ url: `/agriculture/identification-result/page`, params })
  },

  // 查询识别结果详情
  getIdentificationResult: async (id: number) => {
    return await request.get({ url: `/agriculture/identification-result/get?id=` + id })
  },

  // 新增识别结果
  createIdentificationResult: async (data: IdentificationResultVO) => {
    return await request.post({ url: `/agriculture/identification-result/create`, data })
  },

  // 修改识别结果
  updateIdentificationResult: async (data: IdentificationResultVO) => {
    return await request.put({ url: `/agriculture/identification-result/update`, data })
  },

  // 删除识别结果
  deleteIdentificationResult: async (id: number) => {
    return await request.delete({ url: `/agriculture/identification-result/delete?id=` + id })
  },

  // 导出识别结果 Excel
  exportIdentificationResult: async (params) => {
    return await request.download({ url: `/agriculture/identification-result/export-excel`, params })
  }
}