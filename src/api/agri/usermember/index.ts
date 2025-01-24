import request from '@/config/axios';

// 用户会员 VO
export interface UserMemberVO {
  id: number; // 主键
  relevanceUserId: number; // 关联用户ID
  membershipType: string; // 会员类型
}

// 用户会员 API
export const UserMemberApi = {
  // 查询用户会员分页
  getUserMemberPage: async (params: any) => {
    return await request.get({ url: `/agri/user-member/page`, params });
  },

  // 查询用户会员详情
  getUserMember: async (id: number) => {
    return await request.get({ url: `/agri/user-member/get?id=` + id });
  },

  // 新增用户会员
  createUserMember: async (data: UserMemberVO) => {
    return await request.post({ url: `/agri/user-member/create`, data });
  },

  // 修改用户会员
  updateUserMember: async (data: UserMemberVO) => {
    return await request.put({ url: `/agri/user-member/update`, data });
  },
  // 修改用户会员
  updateUserMemberType: async (data: UserMemberVO) => {
    return await request.put({ url: `/agri/user-member/update-type`, data });
  },

  // 删除用户会员
  deleteUserMember: async (id: number) => {
    return await request.delete({ url: `/agri/user-member/delete?id=` + id });
  },

  // 导出用户会员 Excel
  exportUserMember: async (params) => {
    return await request.download({ url: `/agri/user-member/export-excel`, params });
  }
};
