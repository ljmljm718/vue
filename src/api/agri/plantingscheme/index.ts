import request from '@/config/axios';

// AI种植方案 VO
export interface PlantingSchemeVO {
  id: number; // 主键ID
  cropName: string; // 作物名称
  cropImage: string; // 作物图片
  category: string; // 类别
  content: string; // 内容
}

// AI种植方案 API
export const PlantingSchemeApi = {
  // 查询AI种植方案分页
  getPlantingSchemePage: async (params: any) => {
    return await request.get({ url: `/agri/planting-scheme/page`, params });
  },

  // 查询AI种植方案详情
  getPlantingScheme: async (id: number) => {
    return await request.get({ url: `/agri/planting-scheme/get?id=` + id });
  },

  // 新增AI种植方案
  createPlantingScheme: async (data: PlantingSchemeVO) => {
    return await request.post({ url: `/agri/planting-scheme/create`, data });
  },

  // 修改AI种植方案
  updatePlantingScheme: async (data: PlantingSchemeVO) => {
    return await request.put({ url: `/agri/planting-scheme/update`, data });
  },

  // 删除AI种植方案
  deletePlantingScheme: async (id: number) => {
    return await request.delete({ url: `/agri/planting-scheme/delete?id=` + id });
  },

  // 导出AI种植方案 Excel
  exportPlantingScheme: async (params) => {
    return await request.download({ url: `/agri/planting-scheme/export-excel`, params });
  }
};
