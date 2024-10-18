import request from '@/config/axios'
import RecognizeForm from '@/views/agriculture/diseasepestsurveillance/RecognizeForm.vue'

// 病虫害监测 VO
export interface DiseasePestSurveillanceVO {
  id: string // 主键
  device: string // 设备
  monitorSpecies: string // 监测物种
  monitorType: string // 监测类型
  monitorTime: Date // 监测时间
  monitorPicture: string // 监测抓图
  belongPark: string // 地块
  identifyStatus: string // 识别状态
  deviceStatus: string // 设备状态
}

// 病虫害监测 API
export const DiseasePestSurveillanceApi = {
  // 查询病虫害监测分页
  getDiseasePestSurveillancePage: async (params: any) => {
    return await request.get({ url: `/agriculture/disease-pest-surveillance/page`, params })
  },

  // 查询病虫害监测详情
  getDiseasePestSurveillance: async (id: number) => {
    return await request.get({ url: `/agriculture/disease-pest-surveillance/get?id=` + id })
  },

  // 新增病虫害监测
  createDiseasePestSurveillance: async (data: DiseasePestSurveillanceVO) => {
    return await request.post({ url: `/agriculture/disease-pest-surveillance/create`, data })
  },

  // 修改病虫害监测
  updateDiseasePestSurveillance: async (data: DiseasePestSurveillanceVO) => {
    return await request.put({ url: `/agriculture/disease-pest-surveillance/update`, data })
  },

  // 删除病虫害监测
  deleteDiseasePestSurveillance: async (id: number) => {
    return await request.delete({ url: `/agriculture/disease-pest-surveillance/delete?id=` + id })
  },

  // 导出病虫害监测 Excel
  exportDiseasePestSurveillance: async (params) => {
    return await request.download({ url: `/agriculture/disease-pest-surveillance/export-excel`, params })
  },
  //新增病虫害识别
  createDiseasePestSurveillanceRecognize: async (data) => {
    return await request.post({ url :`/agriculture/identification-result/batch-create` ,data})
  }
}
