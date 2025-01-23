import request from '@/config/axios';

// 农药登记 VO
export interface PesticideRegistrationVO {
  id: number; // 序号
  registrationNumber: string; // 登记证号
  holder: string; // 登记证持有人
  pesticideName: string; // 农药名称
  formulation: string; // 剂型
  toxicity: string; // 毒性
  activeIngredients: string; // 有效成分及其含量
  pesticideCategory: string; // 农药类别
  cropOrPlace: string; // 作物/场所
  controlObject: string; // 防治对象
  qualityStandardNumber: string; // 产品质量标准号
  usageRate: string; //用药量(制剂量/亩)
  applicationMethod: string; //施用方式
  technicalRequirements: string; //使用技术要求
  productPerformance: string; //产品性能
  precautions: string; //注意事项
  poisoningFirstAid: string; //中毒急救措施
  storageAndTransport: string; //存储和运输方式
  qualityAssurancePeriod: string; //质量保证期
  remarks: string; //备注
  approvalDate: Date; //核准日期
  reapprovalDate: Date; //重新核准日期
  pesticideRegistrationSubDOList: []; // 用药量信息
  pesticideMatterSubDOList: []; // 农药注意事项
}

// 农药登记 API
export const PesticideRegistrationApi = {
  // 查询农药登记分页
  getPesticideRegistrationPage: async (params: any) => {
    return await request.get({ url: `/agriculture/pesticide-registration/page`, params });
  },

  // 查询农药登记详情
  getPesticideRegistration: async (id: number) => {
    return await request.get({ url: `/agriculture/pesticide-registration/get?id=` + id });
  },

  // 新增农药登记
  createPesticideRegistration: async (data: PesticideRegistrationVO) => {
    return await request.post({ url: `/agriculture/pesticide-registration/create`, data });
  },

  // 修改农药登记
  updatePesticideRegistration: async (data: PesticideRegistrationVO) => {
    return await request.put({ url: `/agriculture/pesticide-registration/update`, data });
  },

  // 删除农药登记
  deletePesticideRegistration: async (id: number) => {
    return await request.delete({ url: `/agriculture/pesticide-registration/delete?id=` + id });
  },

  // 导出农药登记 Excel
  exportPesticideRegistration: async (params) => {
    return await request.download({
      url: `/agriculture/pesticide-registration/export-excel`,
      params
    });
  },
  // 用药量信息
  createBatchPesticideRegistrationSubDO: async (data: any) => {
    return await request.post({ url: `/agriculture/pesticide-registration-sub/create `, data });
  },
  // 获得用药量信息分页
  getPesticideRegistrationSubDO: async (params: any) => {
    return await request.get({ url: `/agriculture/pesticide-registration-sub/page`, params });
  }
};
