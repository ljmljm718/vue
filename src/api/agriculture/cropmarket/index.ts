import request from '@/config/axios';

// 农作物市场行情 VO
export interface CropMarketVO {
  id: number; // ID
  cropName: string; // 农作物名称
  date: Date; // 日期
  origin: string; // 产地
  price: number; // 当前价格（元/斤）
  remarks: string; // 备注
}

// 农作物市场行情 API
export const CropMarketApi = {
  // 查询农作物市场行情分页
  getCropMarketPage: async (params: any) => {
    return await request.get({ url: `/agriculture/crop-market/page`, params });
  },

  // 查询农作物市场行情详情
  getCropMarket: async (id: number) => {
    return await request.get({ url: `/agriculture/crop-market/get?id=` + id });
  },

  // 新增农作物市场行情
  createCropMarket: async (data: CropMarketVO) => {
    return await request.post({ url: `/agriculture/crop-market/create`, data });
  },

  // 修改农作物市场行情
  updateCropMarket: async (data: CropMarketVO) => {
    return await request.put({ url: `/agriculture/crop-market/update`, data });
  },

  // 删除农作物市场行情
  deleteCropMarket: async (id: number) => {
    return await request.delete({ url: `/agriculture/crop-market/delete?id=` + id });
  },

  // 导出农作物市场行情 Excel
  exportCropMarket: async (params) => {
    return await request.download({ url: `/agriculture/crop-market/export-excel`, params });
  }
};
