import request from '@/config/axios';

// 头像信息 VO
export interface AvatarInfoVO {
  id: number; // 头像ID
  avatarUrl: string; // 头像图片链接
}

// 头像信息 API
export const AvatarInfoApi = {
  // 查询头像信息分页
  getAvatarInfoPage: async (params: any) => {
    return await request.get({ url: `/agri/avatar-info/page`, params });
  },

  // 查询头像信息详情
  getAvatarInfo: async (id: number) => {
    return await request.get({ url: `/agri/avatar-info/get?id=` + id });
  },

  // 新增头像信息
  createAvatarInfo: async (data: AvatarInfoVO) => {
    return await request.post({ url: `/agri/avatar-info/create`, data });
  },

  // 修改头像信息
  updateAvatarInfo: async (data: AvatarInfoVO) => {
    return await request.put({ url: `/agri/avatar-info/update`, data });
  },

  // 删除头像信息
  deleteAvatarInfo: async (id: number) => {
    return await request.delete({ url: `/agri/avatar-info/delete?id=` + id });
  },

  // 导出头像信息 Excel
  exportAvatarInfo: async (params) => {
    return await request.download({ url: `/agri/avatar-info/export-excel`, params });
  }
};
