import request from '@/config/axios';

// AI提示词 VO
export interface PromptsVO {
  id: number; // 主键
  title: string; // 标题
  content: string; // 内容
}

// AI提示词 API
export const PromptsApi = {
  // 查询AI提示词分页
  getPromptsPage: async (params: any) => {
    return await request.get({ url: `/agri/prompts/page`, params });
  },

  // 查询AI提示词详情
  getPrompts: async (id: number) => {
    return await request.get({ url: `/agri/prompts/get?id=` + id });
  },

  // 新增AI提示词
  createPrompts: async (data: PromptsVO) => {
    return await request.post({ url: `/agri/prompts/create`, data });
  },

  // 修改AI提示词
  updatePrompts: async (data: PromptsVO) => {
    return await request.put({ url: `/agri/prompts/update`, data });
  },

  // 删除AI提示词
  deletePrompts: async (id: number) => {
    return await request.delete({ url: `/agri/prompts/delete?id=` + id });
  },

  // 导出AI提示词 Excel
  exportPrompts: async (params) => {
    return await request.download({ url: `/agri/prompts/export-excel`, params });
  }
};
