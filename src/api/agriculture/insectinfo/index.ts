import request from '@/config/axios'

// 虫情信息 VO
export interface InsectInfoVO {
  id: number // id
  equipmentCode: number // 设备id
  collectionTime: Date // 采集时间
  insectPestNumber: string // 虫害数量
  insectPestKind: string // 虫害种类
  insectTemperature: string // 杀虫仓温度
  dryingTemperature: string // 烘干仓温度
  insectLampStatus: string // 诱虫灯状态
  killInsectStatus: string // 杀虫灯状态
  killInsectBaffleStatus: string // 杀虫灯挡板状态
  insectVideo: string // 摄像头状态

}

// 虫情信息 API
export const InsectInfoApi = {
  // 查询虫情信息分页
  getInsectInfoPage: async (params: any) => {
    return await request.get({ url: `/agri/insect-info/page`, params })
  },

  // 查询虫情信息详情
  getInsectInfo: async (id: number) => {
    return await request.get({ url: `/agri/insect-info/get?id=` + id })
  },

  // 新增虫情信息
  createInsectInfo: async (data: InsectInfoVO) => {
    return await request.post({ url: `/agri/insect-info/create`, data })
  },

  // 修改虫情信息
  updateInsectInfo: async (data: InsectInfoVO) => {
    return await request.put({ url: `/agri/insect-info/update`, data })
  },

  // 删除虫情信息
  deleteInsectInfo: async (id: number) => {
    return await request.delete({ url: `/agri/insect-info/delete?id=` + id })
  },

  // 导出虫情信息 Excel
  exportInsectInfo: async (params) => {
    return await request.download({ url: `/agri/insect-info/export-excel`, params })
  },
}
