import request from '@/config/axios';

// 供销信息 VO
export interface SupplyMarketInfoVO {
  id: string; // 主键ID
  name: string; // 名称
  position: string; // 位置
  image: string; // 图片
  introduction: string; // 介绍信息
  crop: string; // 作物
  category: string; // 类别
  workUnit: string; // 工作单位
  contactInfo: string; // 联系方式
}

// 供销信息 API
export const SupplyMarketInfoApi = {
  // 查询供销信息分页
  getSupplyMarketInfoPage: async (params: any) => {
    return await request.get({ url: `/agri/supply-market-info/page`, params });
  },

  // 查询供销信息详情
  getSupplyMarketInfo: async (id: number) => {
    return await request.get({ url: `/agri/supply-market-info/get?id=` + id });
  },

  // 新增供销信息
  createSupplyMarketInfo: async (data: SupplyMarketInfoVO) => {
    return await request.post({ url: `/agri/supply-market-info/create`, data });
  },

  // 修改供销信息
  updateSupplyMarketInfo: async (data: SupplyMarketInfoVO) => {
    return await request.put({ url: `/agri/supply-market-info/update`, data });
  },

  // 删除供销信息
  deleteSupplyMarketInfo: async (id: number) => {
    return await request.delete({ url: `/agri/supply-market-info/delete?id=` + id });
  },

  // 导出供销信息 Excel
  exportSupplyMarketInfo: async (params) => {
    return await request.download({ url: `/agri/supply-market-info/export-excel`, params });
  }
};
