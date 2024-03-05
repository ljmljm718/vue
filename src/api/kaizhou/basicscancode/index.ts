import request from '@/config/axios'

// 扫码记录 VO
export interface BasicScanCodeVO {
  id: string // id
  identificationCode: string // 标识码
  scanTime: Date // 扫码时间
  scanIp: string // 扫码ip
  scanLon: string // 扫码经度
  scanLat: string // 扫码纬度
  scanLocation: string // 扫码位置
  tenantId:undefined,//租户id
}

// 扫码记录 API
export const BasicScanCodeApi = {
  // 查询扫码记录分页
  getBasicScanCodePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/basic-scan-code/page`, params })
  },

  // 查询扫码记录详情
  getBasicScanCode: async (id: number) => {
    return await request.get({ url: `/kaizhou/basic-scan-code/get?id=` + id })
  },

  // 新增扫码记录
  createBasicScanCode: async (data: BasicScanCodeVO) => {
    return await request.post({ url: `/kaizhou/basic-scan-code/create`, data })
  },

  // 修改扫码记录
  updateBasicScanCode: async (data: BasicScanCodeVO) => {
    return await request.put({ url: `/kaizhou/basic-scan-code/update`, data })
  },

  // 删除扫码记录
  deleteBasicScanCode: async (id: number) => {
    return await request.delete({ url: `/kaizhou/basic-scan-code/delete?id=` + id })
  },

  // 导出扫码记录 Excel
  exportBasicScanCode: async (params) => {
    return await request.download({ url: `/kaizhou/basic-scan-code/export-excel`, params })
  },

}
