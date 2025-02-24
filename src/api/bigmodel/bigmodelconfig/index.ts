import request from '@/config/axios';

// 模型配置 VO
export interface BigModelConfigVO {
  id: string; // 主键
  modelType: string; // 模型类型
  name: string; // 名称
  embeddingModel: string; // 嵌入模型
  authorization: string; // 鉴权
  indexType: string; // 索引类型
  embeddingDimension: string; //向量维度
  quant: string; // 量化方式
  chunkLength: string; // 片段长度
  searchType: string; // 检索类型
  bigModel: string; // 所属大模型
}

// 模型配置 API
export const BigModelConfigApi = {
  // 查询模型配置分页
  getBigModelConfigPage: async (params: any) => {
    return await request.get({ url: `/bigmodel/big-model-config/page`, params });
  },

  // 查询模型配置详情
  getBigModelConfig: async (id: number) => {
    return await request.get({ url: `/bigmodel/big-model-config/get?id=` + id });
  },

  // 新增模型配置
  createBigModelConfig: async (data: BigModelConfigVO) => {
    return await request.post({ url: `/bigmodel/big-model-config/create`, data });
  },

  // 修改模型配置
  updateBigModelConfig: async (data: BigModelConfigVO) => {
    return await request.put({ url: `/bigmodel/big-model-config/update`, data });
  },

  // 删除模型配置
  deleteBigModelConfig: async (id: number) => {
    return await request.delete({ url: `/bigmodel/big-model-config/delete?id=` + id });
  },

  // 导出模型配置 Excel
  exportBigModelConfig: async (params) => {
    return await request.download({ url: `/bigmodel/big-model-config/export-excel`, params });
  }
};
