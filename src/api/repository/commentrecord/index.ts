import request from '@/config/axios';

// 评价记录 VO
export interface CommentRecordVO {
  commentId: number; // 主键
  toId: number; // 评价对象序号
  recoverId: number; // 回复评论序号
  comment: string; // 评论内容
  commentTime: Date; // 评论时间
}

// 评价记录 API
export const CommentRecordApi = {
  // 查询评价记录分页
  getCommentRecordPage: async (params: any) => {
    return await request.get({ url: `/repository/comment-record/page`, params });
  },

  // 查询评价记录详情
  getCommentRecord: async (id: number) => {
    return await request.get({ url: `/repository/comment-record/get?id=` + id });
  },

  // 新增评价记录
  createCommentRecord: async (data: CommentRecordVO) => {
    return await request.post({ url: `/repository/comment-record/create`, data });
  },

  // 修改评价记录
  updateCommentRecord: async (data: CommentRecordVO) => {
    return await request.put({ url: `/repository/comment-record/update`, data });
  },

  // 删除评价记录
  deleteCommentRecord: async (id: number) => {
    return await request.delete({ url: `/repository/comment-record/delete?id=` + id });
  },

  // 导出评价记录 Excel
  exportCommentRecord: async (params) => {
    return await request.download({ url: `/repository/comment-record/export-excel`, params });
  }
};
