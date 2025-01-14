import request from '@/config/axios';

// 农业缺素 VO
export interface DeficiencyElementVO {
  id: number; // 主键
  plantType: string; // 植物类型
  deficiencyElement: string; // 存储缺少的元素
  deficiencySymptoms: string; // 缺素症状的详细描述
  deficiencyStage: string; // 缺素发生阶段
  diagnosisMethod: string; // 诊断方法
  treatmentMeasures: string; // 补救措施
  treatmentEffect: string; // 补救效果
  recordTime: Date; // 记录时间
  image: string; // 图片
}

// 农业缺素 API
export const DeficiencyElementApi = {
  // 查询农业缺素分页
  getDeficiencyElementPage: async (params: any) => {
    return await request.get({ url: `/agriculture/deficiency-element/page`, params });
  },

  // 查询农业缺素详情
  getDeficiencyElement: async (id: number) => {
    return await request.get({ url: `/agriculture/deficiency-element/get?id=` + id });
  },

  // 新增农业缺素
  createDeficiencyElement: async (data: DeficiencyElementVO) => {
    return await request.post({ url: `/agriculture/deficiency-element/create`, data });
  },

  // 修改农业缺素
  updateDeficiencyElement: async (data: DeficiencyElementVO) => {
    return await request.put({ url: `/agriculture/deficiency-element/update`, data });
  },

  // 删除农业缺素
  deleteDeficiencyElement: async (id: number) => {
    return await request.delete({ url: `/agriculture/deficiency-element/delete?id=` + id });
  },

  // 导出农业缺素 Excel
  exportDeficiencyElement: async (params) => {
    return await request.download({ url: `/agriculture/deficiency-element/export-excel`, params });
  }
};
