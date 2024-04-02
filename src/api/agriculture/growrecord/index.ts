import request from '@/config/axios'

// 长势管理 VO
export interface GrowRecordVO {
  cropCode: string // 品种code
  cropName: string // 品种名称
  cropType: string // 品种
  base: string // 所属基地
  baseName: string // 基地名称
  massif: string // 所属地块
  massifName: string // 地块名称
  measureTime: Date // 测量时间
  measurer: string // 测量者
  measureType: string // 测量类型
  measureNum: number // 测量值
  measureSpike: number // 变化量
  measureUnit: string // 测量单位
  remark: string // 备注
  id: string // 主键ID
}

// 长势管理 API
export const GrowRecordApi = {
  // 查询长势管理分页
  getGrowRecordPage: async (params: any) => {
    return await request.get({ url: `/agriculture/grow-record/page`, params })
  },

  // 查询长势管理详情
  getGrowRecord: async (id: number) => {
    return await request.get({ url: `/agriculture/grow-record/get?id=` + id })
  },

  // 新增长势管理
  createGrowRecord: async (data: GrowRecordVO) => {
    return await request.post({ url: `/agriculture/grow-record/create`, data })
  },

  // 修改长势管理
  updateGrowRecord: async (data: GrowRecordVO) => {
    return await request.put({ url: `/agriculture/grow-record/update`, data })
  },

  // 删除长势管理
  deleteGrowRecord: async (id: number) => {
    return await request.delete({ url: `/agriculture/grow-record/delete?id=` + id })
  },

  // 导出长势管理 Excel
  exportGrowRecord: async (params) => {
    return await request.download({ url: `/agriculture/grow-record/export-excel`, params })
  }
}