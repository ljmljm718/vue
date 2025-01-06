import request from '@/config/axios';

// 肥料登记 VO
export interface FertilizerRegistrationVO {
  id: number; // 序号
  companyName: string; // 企业名称
  genericName: string; // 产品通用名称
  brandName: string; // 产品商品名称
  productForm: string; // 产品形态
  technicalSpecifications: string; // 登记技术指标
  scopeOfMatter: string; // 事宜范围
  registrationNumber: string; // 登记证号
  registrationValidity: Date; // 登记有效期
}

// 肥料登记 API
export const FertilizerRegistrationApi = {
  // 查询肥料登记分页
  getFertilizerRegistrationPage: async (params: any) => {
    return await request.get({ url: `/agriculture/fertilizer-registration/page`, params });
  },

  // 查询肥料登记详情
  getFertilizerRegistration: async (id: number) => {
    return await request.get({ url: `/agriculture/fertilizer-registration/get?id=` + id });
  },

  // 新增肥料登记
  createFertilizerRegistration: async (data: FertilizerRegistrationVO) => {
    return await request.post({ url: `/agriculture/fertilizer-registration/create`, data });
  },

  // 修改肥料登记
  updateFertilizerRegistration: async (data: FertilizerRegistrationVO) => {
    return await request.put({ url: `/agriculture/fertilizer-registration/update`, data });
  },

  // 删除肥料登记
  deleteFertilizerRegistration: async (id: number) => {
    return await request.delete({ url: `/agriculture/fertilizer-registration/delete?id=` + id });
  },

  // 导出肥料登记 Excel
  exportFertilizerRegistration: async (params) => {
    return await request.download({
      url: `/agriculture/fertilizer-registration/export-excel`,
      params
    });
  }
};
