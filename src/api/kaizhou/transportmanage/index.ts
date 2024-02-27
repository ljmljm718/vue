import request from '@/config/axios'

// 运输管理 VO
export interface TransportManageVO {
  id: number // 主键
  transportNo: string // 运输单号
  startProvince: string // 起点省份
  startCity: string // 起点城市
  startArea: string // 起点区域
  endProvince: string // 终点省份
  endCity: string // 终点城市
  endArea: string // 终点区域
  productId: number // 产品编号
  productName: string // 产品名称
  categoryId: number // 产品类型
  transportTime: Date // 运输时间
  transportCount: string // 运输数量
  productUnitId: number // 产品单位
  vehicleLicense: string // 车牌号
}

// 运输管理 API
export const TransportManageApi = {
  // 查询运输管理分页
  getTransportManagePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/transport-manage/page`, params })
  },

  // 查询运输管理详情
  getTransportManage: async (id: number) => {
    return await request.get({ url: `/kaizhou/transport-manage/get?id=` + id })
  },

  // 新增运输管理
  createTransportManage: async (data: TransportManageVO) => {
    return await request.post({ url: `/kaizhou/transport-manage/create`, data })
  },

  // 修改运输管理
  updateTransportManage: async (data: TransportManageVO) => {
    return await request.put({ url: `/kaizhou/transport-manage/update`, data })
  },

  // 删除运输管理
  deleteTransportManage: async (id: number) => {
    return await request.delete({ url: `/kaizhou/transport-manage/delete?id=` + id })
  },

  // 导出运输管理 Excel
  exportTransportManage: async (params) => {
    return await request.download({ url: `/kaizhou/transport-manage/export-excel`, params })
  },
}