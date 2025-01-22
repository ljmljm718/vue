import request from '@/config/axios';

// 作物适宜规则 VO
export interface CropSuitabilityRuleVO {
  id: number; // 主键
  crop: string; // 作物
  phenologicalStage: string; // 生长物候
  suitableActivity: string; // 适宜活动
  phenologicalStartDate: Date; // 物候开始时间
  phenologicalEndDate: Date; // 物候结束时间
  temperatureUpper: number; // 温度上限
  temperatureLower: number; // 温度下限
  suitabilityLevel: string; // 适宜度
  suitabilityDescription: string; // 适宜度说明
  referenceSuggestions: string; // 参考对策建议
}

// 作物适宜规则 API
export const CropSuitabilityRuleApi = {
  // 查询作物适宜规则分页
  getCropSuitabilityRulePage: async (params: any) => {
    return await request.get({ url: `/agri/crop-suitability-rule/page`, params });
  },

  // 查询作物适宜规则详情
  getCropSuitabilityRule: async (id: number) => {
    return await request.get({ url: `/agri/crop-suitability-rule/get?id=` + id });
  },

  // 新增作物适宜规则
  createCropSuitabilityRule: async (data: CropSuitabilityRuleVO) => {
    return await request.post({ url: `/agri/crop-suitability-rule/create`, data });
  },

  // 修改作物适宜规则
  updateCropSuitabilityRule: async (data: CropSuitabilityRuleVO) => {
    return await request.put({ url: `/agri/crop-suitability-rule/update`, data });
  },

  // 删除作物适宜规则
  deleteCropSuitabilityRule: async (id: number) => {
    return await request.delete({ url: `/agri/crop-suitability-rule/delete?id=` + id });
  },

  // 导出作物适宜规则 Excel
  exportCropSuitabilityRule: async (params) => {
    return await request.download({ url: `/agri/crop-suitability-rule/export-excel`, params });
  }
};
