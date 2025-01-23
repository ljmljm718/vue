import request from '@/config/axios';

// 点赞记录 VO
export interface LikeRecordVO {
  id: number; // 主键
  likeId: string; // 点赞ID
  likeUser: string; // 点赞用户
}

// 点赞记录 API
export const LikeRecordApi = {
  // 查询点赞记录分页
  getLikeRecordPage: async (params: any) => {
    return await request.get({ url: `/repository/like-record/page`, params });
  },

  // 查询点赞记录详情
  getLikeRecord: async (id: number) => {
    return await request.get({ url: `/repository/like-record/get?id=` + id });
  },

  // 新增点赞记录
  createLikeRecord: async (data: LikeRecordVO) => {
    return await request.post({ url: `/repository/like-record/create`, data });
  },

  // 修改点赞记录
  updateLikeRecord: async (data: LikeRecordVO) => {
    return await request.put({ url: `/repository/like-record/update`, data });
  },

  // 删除点赞记录
  deleteLikeRecord: async (id: number) => {
    return await request.delete({ url: `/repository/like-record/delete?id=` + id });
  },

  // 导出点赞记录 Excel
  exportLikeRecord: async (params) => {
    return await request.download({ url: `/repository/like-record/export-excel`, params });
  }
};
