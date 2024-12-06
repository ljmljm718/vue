import request from '@/config/axios';

// 录像机设备信息 VO
export interface DeviceNvrVO {
  id: string; // 主键
  deviceSerial: string; // 设备序列号
  deviceName: string; // 设备名称
  appId: string; // 应用Id
  secretKey: string; // 密钥
  belongSys: string; // 所属系统
  remark: string; // 备注
  remark1: string; // 备注1
  remark2: string; // 备注2
  manufacturer: string; // 厂商
}

// 录像机设备信息 API
export const DeviceNvrApi = {
  // 查询录像机设备信息分页
  getDeviceNvrPage: async (params: any) => {
    return await request.get({ url: `/agriculture/device-nvr/page`, params });
  },

  // 查询录像机设备信息详情
  getDeviceNvr: async (id: number) => {
    return await request.get({ url: `/agriculture/device-nvr/get?id=` + id });
  },

  // 新增录像机设备信息
  createDeviceNvr: async (data: DeviceNvrVO) => {
    return await request.post({ url: `/agriculture/device-nvr/create`, data });
  },

  // 修改录像机设备信息
  updateDeviceNvr: async (data: DeviceNvrVO) => {
    return await request.put({ url: `/agriculture/device-nvr/update`, data });
  },

  // 删除录像机设备信息
  deleteDeviceNvr: async (id: number) => {
    return await request.delete({ url: `/agriculture/device-nvr/delete?id=` + id });
  },

  // 导出录像机设备信息 Excel
  exportDeviceNvr: async (params) => {
    return await request.download({ url: `/agriculture/device-nvr/export-excel`, params });
  }
};
