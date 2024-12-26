import request from '@/config/axios';
import axios from 'axios';

// 获取知识库列表
export const getCollectionList = async () => {
  return await request.get({ url: '/agriculture/collection/get-collection-list' });
};

export const getCollectionSearch = async (data: any) => {
  return await request.post({ url: `/agriculture/collection/search`, data });
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

// 远端collection不存在时 删除数据库中的那条数据
export const postForceDeleteLib = async (params: any) => {
  return await request.post({ url: '/agriculture/collection/force-delete-collection', params });
};

// 添加文档
export const postAddDoc = async (data: any) => {
  return await request.post({ url: '/agriculture/collection/add', data });
};

// 删除文档
export const postDeleteDoc = async (params: any) => {
  return await request.post({ url: '/agriculture/collection/delete-doc', params });
};

// ---- 聊天记录相关接口 -------
// 聊天记录分页查询
export const chatThemePage = async (params: any) => {
  return await request.get({ url: '/agriculture/chat-theme/page', params });
};

// 聊天记录分页查询
export const chatHistoryPage = async (params: any) => {
  return await request.get({ url: '/agriculture/chat-history/page', params });
};

// 删除聊天主题与聊天记录
export const chatThemeDelete = async (params: any) => {
  return await request.delete({ url: '/agriculture/chat-theme/delete', params });
};

// 删除文档
export const chatThemeCreate = async (data: any) => {
  return await request.post({ url: '/agriculture/chat-theme/create', data });
};

// 语音识别
export const asr = async (params: any) => {
  return await request.get({ url: `/agriculture/asr/asr`, params });
};

// 编辑聊天主题
export const putUpdateChatTheme = async (data: any) => {
  return await request.put({ url: `/agriculture/chat-theme/update`, data });
};

// 视觉模型新增消息记录
export const postCreateChatHistory = async (data: any) => {
  return await request.post({ url: '/agriculture/chat-history/create', data });
};

// 图文解析
export const postImgToText = async (data: any) => {
  const url = '/api/v3/chat/completions';

  const service = axios.create({
    baseURL: '/ark',
    timeout: 30000
  });

  const res = await service({
    url: url,
    method: 'POST',
    headers: {
      Authorization: 'Bearer 6a9d9495-041d-459a-8cea-4688f57495ae'
    },
    data
  });

  return { data: res.data, code: res.status };
};

// 文生图
export const postTextToImg = async (params: any, data: any, headers: any) => {
  // https://visual.volcengineapi.com

  const service = axios.create({
    baseURL: '/visual',
    timeout: 30000
  });

  const res = await service({
    url: '',
    method: 'POST',
    params,
    data: data,
    headers: {
      // Authorization: 'Bearer 6a9d9495-041d-459a-8cea-4688f57495ae',
      ...headers
    }
  });

  return res;
};

// 获取文生图token'
export const collectionGetToken = async (params: any) => {
  return await request.get({ url: '/agriculture/collection/get-token', params });
};

export const getauth = async (params: any) => {
  return await axios.get('/tdCache/api/text2img', { params });
};
