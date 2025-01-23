import request from '@/config/axios';

// 声音信息 VO
export interface VoiceInfoVO {
  id: number; // ID
  avatar: string; // 头像
  voiceCode: string; // 声音标识
  description: string; // 介绍
  file: string; // 试听文件
}

// 声音信息 API
export const VoiceInfoApi = {
  // 查询声音信息分页
  getVoiceInfoPage: async (params: any) => {
    return await request.get({ url: `/bigmodel/voice-info/page`, params });
  },

  // 查询声音信息详情
  getVoiceInfo: async (id: number) => {
    return await request.get({ url: `/bigmodel/voice-info/get?id=` + id });
  },

  // 新增声音信息
  createVoiceInfo: async (data: VoiceInfoVO) => {
    return await request.post({ url: `/bigmodel/voice-info/create`, data });
  },

  // 修改声音信息
  updateVoiceInfo: async (data: VoiceInfoVO) => {
    return await request.put({ url: `/bigmodel/voice-info/update`, data });
  },

  // 删除声音信息
  deleteVoiceInfo: async (id: number) => {
    return await request.delete({ url: `/bigmodel/voice-info/delete?id=` + id });
  },

  // 导出声音信息 Excel
  exportVoiceInfo: async (params) => {
    return await request.download({ url: `/bigmodel/voice-info/export-excel`, params });
  }
};
