import request from '@/config/axios'

// 鲁渝协作品种管理 VO
export interface CropBaseVO {
  id: string // 主键
  cropCode: string // 编号
  breedId:string
  cropName: string // 名称
  cropType: string // 品种
  imgId: string // 图片
  cropDesc: string // 描述
  remark: string // 备注
  belongPark: string // 所属地块
  belongPlot: string // 所属园区
  parkName:string
  plotName:string
  deptId: string // 部门id
  userId: string // 用户id
  batchQrImg: string[] // 二维码
  batchCode: string// 批次码
  receiptStartTime: string// 开始时间
  receiptEndTime: string// 结束时间
  recoveryNo: boolean// 是否采收
  number: string // 数量
  unit: string // 单位
  isEnableModel: boolean // 是否启用模型
}

// 鲁渝协作品种管理 API
export const CropBaseApi = {
  // 查询鲁渝协作品种管理分页
  getCropBasePage: async (params: any) => {
    return await request.get({ url: `/agriculture/crop-base/page`, params })
  },

  // 查询鲁渝协作品种管理详情
  getCropBase: async (id: number) => {
    return await request.get({ url: `/agriculture/crop-base/get?id=` + id })
  },

  // 新增鲁渝协作品种管理
  createCropBase: async (data: CropBaseVO) => {
    return await request.post({ url: `/agriculture/crop-base/create`, data })
  },

  // 修改鲁渝协作品种管理
  updateCropBase: async (data: CropBaseVO) => {
    return await request.put({ url: `/agriculture/crop-base/update`, data })
  },

  // 删除鲁渝协作品种管理
  deleteCropBase: async (id: number) => {
    return await request.delete({ url: `/agriculture/crop-base/delete?id=` + id })
  },

  // 导出鲁渝协作品种管理 Excel
  exportCropBase: async (params) => {
    return await request.download({ url: `/agriculture/crop-base/export-excel`, params })
  },

  // 修改品种模型绑定状态
  updateModelEnableStatus: async (id: any, isEnableModel: any) => {
    const data = {
      id,
      isEnableModel
    }
    return await request.put({ url: `/agriculture/crop-base/updateStatus`, data })
  },

  // 根据批次码获得农事记录结果
  getFarmRecordByBatchCode: async (params) => {
    return await request.get({ url: `/agri/farm-record/get-farm-record-by-batchcode`, params })
  },

  // 获得种植管理批次码倒序分页
  getBatchCodePage: async (params) => {
    return await request.get({ url: `/agriculture/crop-base/batch-code-page`, params })
  }
}
