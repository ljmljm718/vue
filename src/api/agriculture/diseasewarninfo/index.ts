import request from '@/config/axios'

// 病虫害预警记录 VO
export interface DiseaseWarnInfoVO {
  id: number // 主键
  warnType: string // 监测类型
  facilityId: string // 设备ID
  breedId: string // 品种ID
  cropName: string // 品种名称
  diseaseType: string // 病害虫种类
  diseaseId: string // 病害虫Id
  warnLowValue: string // 阈值下限
  warnHighValue: string // 阈值上限
  warnUnit: string // 单位
  lowMsg: string // 预警信息
  monitorPeriod: string // 监测周期
  belongPark: string // 所属基地
  belongPlot: string // 所属地块
  parkName: string // 基地名称
  plotName: string // 地块名称
  reservedOne: string // 预留1
  reservedTwo: string // 预留2
  reservedThree: string // 预留3
  reservedFour: string // 预留4
  reservedFive: string // 预留5
  remark: string // 备注
}

// 病虫害预警记录 API
export const DiseaseWarnInfoApi = {
  // 查询病虫害预警记录分页
  getDiseaseWarnInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/disease-warn-info/page`, params })
  },

  // 查询病虫害预警记录详情
  getDiseaseWarnInfo: async (id: number) => {
    return await request.get({ url: `/agriculture/disease-warn-info/get?id=` + id })
  },

  // 新增病虫害预警记录
  createDiseaseWarnInfo: async (data: DiseaseWarnInfoVO) => {
    return await request.post({ url: `/agriculture/disease-warn-info/create`, data })
  },

  // 修改病虫害预警记录
  updateDiseaseWarnInfo: async (data: DiseaseWarnInfoVO) => {
    return await request.put({ url: `/agriculture/disease-warn-info/update`, data })
  },

  // 删除病虫害预警记录
  deleteDiseaseWarnInfo: async (id: number) => {
    return await request.delete({ url: `/agriculture/disease-warn-info/delete?id=` + id })
  },

  // 导出病虫害预警记录 Excel
  exportDiseaseWarnInfo: async (params) => {
    return await request.download({ url: `/agriculture/disease-warn-info/export-excel`, params })
  }
}