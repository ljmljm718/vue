import request from '@/config/axios'

// 设备数据 VO
export interface EquipmentDataVO {
  id: string // 主键
  equipmentCode: string // 设备编码
  collectionType: string // 采集类型
  monitoringType: string // 监测类型
  dataValue: string // 数据值
  yyUnit: string // 单位
  collectionTime: Date // 采集时间
  baseCode: string // 基地编码
  plotCode: string // 地块编码
  channelId: string // 通道编码
  yyRemarks: string // 备注
  reserveOne: string // 备用一
  reserveTwo: string // 备用二
  reserveThree: string // 备用三
}

// 设备数据 API
export const EquipmentDataApi = {
  // 查询设备数据分页
  getEquipmentDataPage: async (params: any) => {
    return await request.get({ url: `/yyang/equipment-data/page`, params })
  },

  // 查询设备数据详情
  getEquipmentData: async (id: number) => {
    return await request.get({ url: `/yyang/equipment-data/get?id=` + id })
  },

  // 新增设备数据
  createEquipmentData: async (data: EquipmentDataVO) => {
    return await request.post({ url: `/yyang/equipment-data/create`, data })
  },

  // 修改设备数据
  updateEquipmentData: async (data: EquipmentDataVO) => {
    return await request.put({ url: `/yyang/equipment-data/update`, data })
  },

  // 删除设备数据
  deleteEquipmentData: async (id: number) => {
    return await request.delete({ url: `/yyang/equipment-data/delete?id=` + id })
  },

  // 导出设备数据 Excel
  exportEquipmentData: async (params) => {
    return await request.download({ url: `/yyang/equipment-data/export-excel`, params })
  },
  // 数据采集上方圆形方块
  getEquipmentDataByEquipmentCode: async (id: string) => {
    return await request.get({ url: `/yyang/equipment-data/getEquipmentDataByEquipmentCode?id=` + id })
  },
  // 数据采集类型柱状图
  getEquipmentDataByEquipmentIdAndType: async (id: string,type:string) => {
    return await request.get({ url: `/yyang/equipment-data/getEquipmentDataByEquipmentIdAndType?id=` + id +`&type=`+type})
  },
  // 数据管理页面根据监测类型查询采集类型列表
  getCollectionType: async (monitoringType:string) => {
    return await request.get({ url: `/yyang/equipment-data/QueryCollectionType?monitoringType=` + monitoringType})
  },


}
