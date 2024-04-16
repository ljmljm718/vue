import request from '@/config/axios'

// 农事报表
export interface AgriculturalReport {
  growth: string // 物候期
  startTime: Date //开始时间
  endTime: Date // 结束时间
  agriTask: string // 农事任务
}

// 农事报表 API
export const AgriculturalReportApi = {
  // 查询作物物候期分页
  getAgriculturalReport: async (params: any) => {
    return await request.get({ url: `/agriculture/warning-record-big-screen/agriculturalReport`, params })
  },

}
