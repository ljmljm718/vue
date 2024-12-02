import request from '@/config/axios';

// 水源信息 VO
export interface WaterSourceVO {
  id: string; // 主键
  wsCode: string; // 水源编号
  wsName: string; // 水源名称
  wsType: string; // 水源类型
  province: string; // 省
  city: string; // 市
  district: string; // 区
  maxLevel: number; // 最高水位（米）
  minLevel: number; // 最低水位（米）
  longitude: string; // 经度
  latitude: string; // 纬度
}

// 水源信息 API
export const WaterSourceApi = {
  // 查询水源信息分页
  getWaterSourcePage: async (params: any) => {
    return await request.get({ url: `/agriculture/water-source/page`, params });
  },

  // 查询水源信息详情
  getWaterSource: async (id: string) => {
    return await request.get({ url: `/agriculture/water-source/get?id=` + id });
  },

  // 新增水源信息
  createWaterSource: async (data: WaterSourceVO) => {
    return await request.post({ url: `/agriculture/water-source/create`, data });
  },

  // 修改水源信息
  updateWaterSource: async (data: WaterSourceVO) => {
    return await request.put({ url: `/agriculture/water-source/update`, data });
  },

  // 删除水源信息
  deleteWaterSource: async (id: number) => {
    return await request.delete({ url: `/agriculture/water-source/delete?id=` + id });
  },

  // 导出水源信息 Excel
  exportWaterSource: async (params) => {
    return await request.download({ url: `/agriculture/water-source/export-excel`, params });
  }
};
