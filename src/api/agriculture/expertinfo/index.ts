import request from '@/config/axios';

// 专家信息 VO
export interface ExpertInfoVO {
  id: number; // 主键ID
  expert: string; // 专家姓名
  serviceArea: string; // 服务区域
  specializedDiseases: string; // 擅长病害
  crop: string; // 作物
  status: string; // 状态
  contactInfo: string; // 联系方式
}

// 专家信息 API
export const ExpertInfoApi = {
  // 查询专家信息分页
  getExpertInfoPage: async (params: any) => {
    return await request.get({ url: `/agriculture/expert-info/page`, params });
  },

  // 查询专家信息详情
  getExpertInfo: async (id: number) => {
    return await request.get({ url: `/agriculture/expert-info/get?id=` + id });
  },

  // 新增专家信息
  createExpertInfo: async (data: ExpertInfoVO) => {
    return await request.post({ url: `/agriculture/expert-info/create`, data });
  },

  // 修改专家信息
  updateExpertInfo: async (data: ExpertInfoVO) => {
    return await request.put({ url: `/agriculture/expert-info/update`, data });
  },

  // 删除专家信息
  deleteExpertInfo: async (id: number) => {
    return await request.delete({ url: `/agriculture/expert-info/delete?id=` + id });
  },

  // 导出专家信息 Excel
  exportExpertInfo: async (params) => {
    return await request.download({ url: `/agriculture/expert-info/export-excel`, params });
  }
};
