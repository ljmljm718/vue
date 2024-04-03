import request from '@/config/axios'

// 土壤墒情 VO
export interface SoilMoistureVO {
  id: number // id
  equipmentCode: number // 设备id
  collectionTime: Date // 采集时间
  soilTemperature: string // 土壤温度
  soilHumidity: string // 土壤湿度
  soilPh: string // PH值
  soilEc: string // EC值
  soilDepth: string // 土壤深度
}

// 土壤墒情 API
export const SoilMoistureApi = {
  // 查询土壤墒情分页
  getSoilMoisturePage: async (params: any) => {
    return await request.get({ url: `/agri/soil-moisture/page`, params })
  },
  getSoilMoisturePageJoin: async (params: any) => {
    return await request.get({ url: `/agri/soil-moisture/pageJoin`, params })
  },

  // 查询土壤墒情详情
  getSoilMoisture: async (id: number) => {
    return await request.get({ url: `/agri/soil-moisture/get?id=` + id })
  },

  // 新增土壤墒情
  createSoilMoisture: async (data: SoilMoistureVO) => {
    return await request.post({ url: `/agri/soil-moisture/create`, data })
  },

  // 修改土壤墒情
  updateSoilMoisture: async (data: SoilMoistureVO) => {
    return await request.put({ url: `/agri/soil-moisture/update`, data })
  },

  // 删除土壤墒情
  deleteSoilMoisture: async (id: number) => {
    return await request.delete({ url: `/agri/soil-moisture/delete?id=` + id })
  },

  // 导出土壤墒情 Excel
  exportSoilMoisture: async (params) => {
    return await request.download({ url: `/agri/soil-moisture/export-excel`, params })
  },
}
