import request from '@/config/axios';

// 农药注意事项 VO
export interface PesticideMatterSubVO {
  id: number; // 用户ID
  title: string; // 农药id
  parentId: string; // 标题
  content: string; // 内容
}

// 农药注意事项 API
export const PesticideMatterSubApi = {
  // 查询农药注意事项分页
  getPesticideMatterSubPage: async (params: any) => {
    return await request.get({ url: `/agriculture/pesticide-matter-sub/page`, params });
  },

  // 查询农药注意事项详情
  getPesticideMatterSub: async (id: number) => {
    return await request.get({ url: `/agriculture/pesticide-matter-sub/get?id=` + id });
  },

  // 新增农药注意事项
  createPesticideMatterSub: async (data: PesticideMatterSubVO) => {
    return await request.post({ url: `/agriculture/pesticide-matter-sub/create`, data });
  },

  // 修改农药注意事项
  updatePesticideMatterSub: async (data: PesticideMatterSubVO) => {
    return await request.put({ url: `/agriculture/pesticide-matter-sub/update`, data });
  },

  // 删除农药注意事项
  deletePesticideMatterSub: async (id: number) => {
    return await request.delete({ url: `/agriculture/pesticide-matter-sub/delete?id=` + id });
  },

  // 导出农药注意事项 Excel
  exportPesticideMatterSub: async (params) => {
    return await request.download({
      url: `/agriculture/pesticide-matter-sub/export-excel`,
      params
    });
  }
};
