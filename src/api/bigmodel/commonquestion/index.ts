import request from '@/config/axios';

// 常见问题 VO
export interface CommonQuestionVO {
  id: number; // id
  appId: number; // 应用的编号
  appName: string; // 应用的名称
  questionType: string; // 问题的分类
  question: string; // 问题的具体描述
  count: number; // 该问题被问到的次数
}

// 常见问题 API
export const CommonQuestionApi = {
  // 查询常见问题分页
  getCommonQuestionPage: async (params: any) => {
    return await request.get({ url: `/bigmodel/common-question/page`, params });
  },

  // 查询常见问题详情
  getCommonQuestion: async (id: number) => {
    return await request.get({ url: `/bigmodel/common-question/get?id=` + id });
  },

  // 新增常见问题
  createCommonQuestion: async (data: CommonQuestionVO) => {
    return await request.post({ url: `/bigmodel/common-question/create`, data });
  },

  // 修改常见问题
  updateCommonQuestion: async (data: CommonQuestionVO) => {
    return await request.put({ url: `/bigmodel/common-question/update`, data });
  },

  // 删除常见问题
  deleteCommonQuestion: async (id: number) => {
    return await request.delete({ url: `/bigmodel/common-question/delete?id=` + id });
  },

  // 导出常见问题 Excel
  exportCommonQuestion: async (params) => {
    return await request.download({ url: `/bigmodel/common-question/export-excel`, params });
  }
};
