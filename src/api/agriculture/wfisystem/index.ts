import request from '@/config/axios';

// 水肥一体化系统信息 VO
export interface WfiSystemVO {
  id: string; // 主键
  sysCode: string; // 系统标识码
  sysName: string; // 系统名称
  belongWaterSource: string; // 所属水源地
  sysStatus: string; // 系统状态,0未启用1启用，默认未启用
}

// 水肥一体化系统信息 API
export const WfiSystemApi = {
  // 查询水肥一体化系统信息分页
  getWfiSystemPage: async (params: any) => {
    return await request.get({ url: `/agriculture/wfi-system/page`, params });
  },

  // 查询水肥一体化系统信息详情
  getWfiSystem: async (id: number) => {
    return await request.get({ url: `/agriculture/wfi-system/get?id=` + id });
  },

  // 新增水肥一体化系统信息
  createWfiSystem: async (data: WfiSystemVO) => {
    return await request.post({ url: `/agriculture/wfi-system/create`, data });
  },

  // 修改水肥一体化系统信息
  updateWfiSystem: async (data: WfiSystemVO) => {
    return await request.put({ url: `/agriculture/wfi-system/update`, data });
  },

  // 删除水肥一体化系统信息
  deleteWfiSystem: async (id: number) => {
    return await request.delete({ url: `/agriculture/wfi-system/delete?id=` + id });
  },

  // 导出水肥一体化系统信息 Excel
  exportWfiSystem: async (params) => {
    return await request.download({ url: `/agriculture/wfi-system/export-excel`, params });
  },

  // ==================== 子表（系统-设备关联） ====================

  // 获得系统-设备关联分页
  getWfiSystemDevicePage: async (params) => {
    return await request.get({ url: `/agriculture/wfi-system/wfi-system-device/page`, params });
  },
  // 新增系统-设备关联
  createWfiSystemDevice: async (data) => {
    return await request.post({ url: `/agriculture/wfi-system/wfi-system-device/create`, data });
  },

  // 修改系统-设备关联
  updateWfiSystemDevice: async (data) => {
    return await request.put({ url: `/agriculture/wfi-system/wfi-system-device/update`, data });
  },

  // 删除系统-设备关联
  deleteWfiSystemDevice: async (id: number) => {
    return await request.delete({
      url: `/agriculture/wfi-system/wfi-system-device/delete?id=` + id
    });
  },

  // 获得系统-设备关联
  getWfiSystemDevice: async (id: number) => {
    return await request.get({ url: `/agriculture/wfi-system/wfi-system-device/get?id=` + id });
  }
};
