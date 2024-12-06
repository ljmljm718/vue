import request from '@/config/axios';

// 获取知识库列表
export const getCollectionList = async () => {
  return await request.get({ url: '/agriculture/collection/get-collection-list' });
};

// 根据知识库ID获取文档列表
export const getDocList = async (params: any) => {
  return await request.get({ url: '/agriculture/collection/get-doc-list', params });
};

// 查询知识库向量化模型
export const getSelectEmbeddingModel = async (params: any) => {
  return await request.get({ url: '/agriculture/collection/select-embedding-model', params });
};

// 创建知识库
export const postCreateLib = async (data: any) => {
  return await request.post({ url: '/agriculture/collection/create', data });
};

// 删除知识库
export const postDeleteLib = async (params: any) => {
  return await request.post({ url: '/agriculture/collection/delete-collection', params });
};

// 添加文档
export const postAddDoc = async (data: any) => {
  return await request.post({ url: '/agriculture/collection/add', data });
};

// 删除文档
export const postDeleteDoc = async (params: any) => {
  return await request.post({ url: '/agriculture/collection/delete-doc', params });
};
