import request from '@/config/axios';

// 病害登记 VO
export interface DiseaseRegistrationVO {
  id: number; // 主键
  diseaseName: string; // 病害名称
  diseaseType: string; // 病害类型
  affectedObject: string; // 发病对象
  affectedPart: string; // 发病部位
  mainSymptoms: string; // 主要症状描述
  onsetConditions: string; // 发病条件
  commonPreventionMethods: string; // 常见防治方法
  preventionNotes: string; // 防治注意事项
  diseasePicture: string; // 病害图片
}

// 病害登记 API
export const DiseaseRegistrationApi = {
  // 查询病害登记分页
  getDiseaseRegistrationPage: async (params: any) => {
    return await request.get({ url: `/agriculture/disease-registration/page`, params });
  },

  // 查询病害登记详情
  getDiseaseRegistration: async (id: number) => {
    return await request.get({ url: `/agriculture/disease-registration/get?id=` + id });
  },

  // 新增病害登记
  createDiseaseRegistration: async (data: DiseaseRegistrationVO) => {
    return await request.post({ url: `/agriculture/disease-registration/create`, data });
  },

  // 修改病害登记
  updateDiseaseRegistration: async (data: DiseaseRegistrationVO) => {
    return await request.put({ url: `/agriculture/disease-registration/update`, data });
  },

  // 删除病害登记
  deleteDiseaseRegistration: async (id: number) => {
    return await request.delete({ url: `/agriculture/disease-registration/delete?id=` + id });
  },

  // 导出病害登记 Excel
  exportDiseaseRegistration: async (params) => {
    return await request.download({
      url: `/agriculture/disease-registration/export-excel`,
      params
    });
  }
};
