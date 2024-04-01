import request from '@/config/axios'

// 巡检记录 VO
export interface CheckLogsVO {
  id: string // 主键
  inspectionNum: string // 巡检编号
  inspectionState: string // 巡检状态
  inspectionResults: string // 巡检结果
  equNum: string // 设备编号
  base: string // 所属基地
  massif: string // 所属地块
  inspector: string // 巡检人
  inspectionTime: Date // 巡检时间
  inspectionImage: string // 巡检影像
  content: string // 巡检内容
}

export interface CheckLogsCountPageVO {
  "pageNo": number,
  "pageSize": number,
  "baseId": string,
  "deviceId": string,
  "categoryName": string,
  "categoryId": string,
  "finishCheckNum": number,
  "unFinishCheckNum": number,
  "inspectionState": string,
  "massif": string,
  "sumNum": number,
  "createTime": string
}

export interface CheckDeviceV0 {
  "pageNo": number,
  "pageSize": number,
  "equNum": string,
  "equName": string,
  "base": string,
  "massif": string,
  "createTime": string,
  "deviceStatus": string,
  "categoryId": string,
  "inspectionState": string,
  "inspectionTime": string,
}

// 巡检记录 API
export const CheckLogsApi = {
  // 查询巡检记录分页
  getCheckLogsPage: async (params: any) => {
    return await request.get({url: `/agriculture/check-logs/page`, params})
  },

  // 查询巡检记录详情
  getCheckLogs: async (id: number) => {
    return await request.get({url: `/agriculture/check-logs/get?id=` + id})
  },

  // 新增巡检记录
  createCheckLogs: async (data: CheckLogsVO) => {
    return await request.post({url: `/agriculture/check-logs/create`, data})
  },

  // 修改巡检记录
  updateCheckLogs: async (data: CheckLogsVO) => {
    return await request.put({url: `/agriculture/check-logs/update`, data})
  },

  // 删除巡检记录
  deleteCheckLogs: async (id: number) => {
    return await request.delete({url: `/agriculture/check-logs/delete?id=` + id})
  },

  // 导出巡检记录 Excel
  exportCheckLogs: async (params) => {
    return await request.download({url: `/agriculture/check-logs/export-excel`, params})
  },

  // 查询巡检设备统计记录分页
  getCountPageByBaseId: async (params: any) => {
    return await request.get({url: `/agriculture/check-logs/getCountPageByBaseId`, params})
  },

  // 查询巡检设备统计分页
  getCheckDeviceBySome: async (params: any) => {
    return await request.get({url: `agriculture/check-logs/getCheckDeviceBySome`, params})
  },
}
