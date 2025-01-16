import request from '@/config/axios';

// 病理跟进 VO
export interface PathologyFollowupVO {
  id: number; // 主键
  plotId: string; // 地块id
  disease: string; // 病虫害
  problem: string; // 问题
  diseaseType: string; // 病虫害类型
  treatment: string; // 治疗措施
  treatmentTime: Date; // 治疗时间
  status: string; // 状态
  effect: string; // 效果
  failureDate: Date; // 失效日
  belongPark: string; // 所属基地
  belongPlot: string; // 所属地块
}

// 病理跟进 API
export const PathologyFollowupApi = {
  // 查询病理跟进分页
  getPathologyFollowupPage: async (params: any) => {
    return await request.get({ url: `/agriculture/pathology-followup/page`, params });
  },

  // 查询病理跟进详情
  getPathologyFollowup: async (id: number) => {
    return await request.get({ url: `/agriculture/pathology-followup/get?id=` + id });
  },

  // 新增病理跟进
  createPathologyFollowup: async (data: PathologyFollowupVO) => {
    return await request.post({ url: `/agriculture/pathology-followup/create`, data });
  },

  // 修改病理跟进
  updatePathologyFollowup: async (data: PathologyFollowupVO) => {
    return await request.put({ url: `/agriculture/pathology-followup/update`, data });
  },

  // 删除病理跟进
  deletePathologyFollowup: async (id: number) => {
    return await request.delete({ url: `/agriculture/pathology-followup/delete?id=` + id });
  },

  // 导出病理跟进 Excel
  exportPathologyFollowup: async (params) => {
    return await request.download({ url: `/agriculture/pathology-followup/export-excel`, params });
  }
};
