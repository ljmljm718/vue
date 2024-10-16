import request from '@/config/axios'

// 病虫害预警阈值设置 VO
export interface DiseaseThresholdRuleVO {
  id: number // 主键
  warnType: string // 监测类型
  breedId: string // 品种ID
  cropName: string // 品种名称
  diseaseType: string // 病害虫种类
  diseaseId: string // 病害虫Id
  warnLowValue: string // 阈值下限
  warnHighValue: string // 阈值上限
  warnUnit: string // 单位
  lowMsg: string // 预警信息
  monitorPeriod: string // 监测周期
  reservedOne: string // 预留1
  reservedTwo: string // 预留2
  reservedThree: string // 预留3
  reservedFour: string // 预留4
  reservedFive: string // 预留5
  remark: string // 备注
}

// 病虫害预警阈值设置 API
export const DiseaseThresholdRuleApi = {
  // 查询病虫害预警阈值设置分页
  getDiseaseThresholdRulePage: async (params: any) => {
    return await request.get({ url: `/agriculture/disease-threshold-rule/page`, params })
  },

  // 查询病虫害预警阈值设置详情
  getDiseaseThresholdRule: async (id: number) => {
    return await request.get({ url: `/agriculture/disease-threshold-rule/get?id=` + id })
  },

  // 新增病虫害预警阈值设置
  createDiseaseThresholdRule: async (data: DiseaseThresholdRuleVO) => {
    return await request.post({ url: `/agriculture/disease-threshold-rule/create`, data })
  },

  // 修改病虫害预警阈值设置
  updateDiseaseThresholdRule: async (data: DiseaseThresholdRuleVO) => {
    return await request.put({ url: `/agriculture/disease-threshold-rule/update`, data })
  },

  // 删除病虫害预警阈值设置
  deleteDiseaseThresholdRule: async (id: number) => {
    return await request.delete({ url: `/agriculture/disease-threshold-rule/delete?id=` + id })
  },

  // 导出病虫害预警阈值设置 Excel
  exportDiseaseThresholdRule: async (params) => {
    return await request.download({ url: `/agriculture/disease-threshold-rule/export-excel`, params })
  }
}