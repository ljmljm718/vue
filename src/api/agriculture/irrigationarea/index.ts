import request from '@/config/axios';

// 灌区信息 VO
export interface IrrigationAreaVO {
  id: string; // 主键
  iaCode: string; // 灌区编号
  iaName: string; // 灌区名称
  irrigationType: string; // 灌溉类型
  iaImage: string; // 图片
  geofencing: string; // 地理围栏
  latitude: string; // 纬度
  longitude: string; // 经度
  principal: string; // 负责人
  contactInformation: string; // 联系方式
  isAddress: string; // 地址
  remark: string; // 备注
}

// 灌区信息 API
export const IrrigationAreaApi = {
  // 查询灌区信息分页
  getIrrigationAreaPage: async (params: any) => {
    return await request.get({ url: `/agriculture/irrigation-area/page`, params });
  },

  // 查询灌区信息详情
  getIrrigationArea: async (id: number) => {
    return await request.get({ url: `/agriculture/irrigation-area/get?id=` + id });
  },

  // 新增灌区信息
  createIrrigationArea: async (data: IrrigationAreaVO) => {
    return await request.post({ url: `/agriculture/irrigation-area/create`, data });
  },

  // 修改灌区信息
  updateIrrigationArea: async (data: IrrigationAreaVO) => {
    return await request.put({ url: `/agriculture/irrigation-area/update`, data });
  },

  // 删除灌区信息
  deleteIrrigationArea: async (id: number) => {
    return await request.delete({ url: `/agriculture/irrigation-area/delete?id=` + id });
  },

  // 导出灌区信息 Excel
  exportIrrigationArea: async (params) => {
    return await request.download({ url: `/agriculture/irrigation-area/export-excel`, params });
  },

  // ==================== 子表（地块基本信息） ====================

  // 获得地块基本信息列表
  getParkDetailListByIaId: async (iaId) => {
    return await request.get({
      url: `/agriculture/park-info/park-detail/list-by-ia-id?iaId=` + iaId
    });
  }
};
