import request from '@/config/axios';

// 虫害防治 VO
export interface AiPestControlVO {
  id: number; // 主键
  pestName: string; // 虫害名称
  pestType: string; // 虫害类别
  hostName: string; // 宿主作物
  lifeCycle: string; // 生命周期
  damage: string; // 危害症状
  monitorType: string; // 监测方法
  prevention: string; // 预防措施
  controlMethod: string; // 控制方法
  imageUrl: string; // 虫害图片
  remark: string; // 备注
}

// 虫害防治 API
export const AiPestControlApi = {
  // 查询虫害防治分页
  getAiPestControlPage: async (params: any) => {
    return await request.get({ url: `/agriculture/ai-pest-control/page`, params });
  },

  // 查询虫害防治详情
  getAiPestControl: async (id: number) => {
    return await request.get({ url: `/agriculture/ai-pest-control/get?id=` + id });
  },

  // 新增虫害防治
  createAiPestControl: async (data: AiPestControlVO) => {
    return await request.post({ url: `/agriculture/ai-pest-control/create`, data });
  },

  // 修改虫害防治
  updateAiPestControl: async (data: AiPestControlVO) => {
    return await request.put({ url: `/agriculture/ai-pest-control/update`, data });
  },

  // 删除虫害防治
  deleteAiPestControl: async (id: number) => {
    return await request.delete({ url: `/agriculture/ai-pest-control/delete?id=` + id });
  },

  // 导出虫害防治 Excel
  exportAiPestControl: async (params) => {
    return await request.download({ url: `/agriculture/ai-pest-control/export-excel`, params });
  }
};
