import request from '@/config/axios'

// 病虫害知识库 VO
export interface DiseaseRepositoryVO {
  id: string // 主键
  scientificName: string // 学名
  imgId: string // 图片
  breedId: string // 品种ID
  cropName: string // 品种名称
  cropType: string // 品类id
  remark: string // 备注
  proneMonth: string // 易发月份
  hazardRating: string // 危害等级
  intro: string // 简介
  description: string // 形态特征
  morbidityCondition: string // 发病条件
  morbidityLaw: string // 发病规律
  manifestedIllness: string // 症状表现
  treatmentMethod: string // 治理方法
  reservedOne: string // 预留1
  reservedTwo: string // 预留2
  reservedThree: string // 预留3
  reservedFour: string // 预留4
}

// 病虫害知识库 API
export const DiseaseRepositoryApi = {
  // 查询病虫害知识库分页
  getDiseaseRepositoryPage: async (params: any) => {
    return await request.get({ url: `/agriculture/disease-repository/page`, params })
  },

  // 查询病虫害知识库详情
  getDiseaseRepository: async (id: number) => {
    return await request.get({ url: `/agriculture/disease-repository/get?id=` + id })
  },

  // 新增病虫害知识库
  createDiseaseRepository: async (data: DiseaseRepositoryVO) => {
    return await request.post({ url: `/agriculture/disease-repository/create`, data })
  },

  // 修改病虫害知识库
  updateDiseaseRepository: async (data: DiseaseRepositoryVO) => {
    return await request.put({ url: `/agriculture/disease-repository/update`, data })
  },

  // 删除病虫害知识库
  deleteDiseaseRepository: async (id: number) => {
    return await request.delete({ url: `/agriculture/disease-repository/delete?id=` + id })
  },

  // 导出病虫害知识库 Excel
  exportDiseaseRepository: async (params) => {
    return await request.download({ url: `/agriculture/disease-repository/export-excel`, params })
  }
}