import request from '@/config/axios';

// 水源-设备关联 VO
export interface WaterSourceDeviceVO {
  id: number; // 主键
  wsId: string; // 水源地id
  deviceId: string; // 设备id
}

//水源绑定设备
export interface WsAndDeviceDTO {
  wsId: string; // 水源id
  deviceId: string[]; // 设备id
}

// 水源-设备关联 API
export const WaterSourceDeviceApi = {
  // 查询水源-设备关联分页
  getWaterSourceDevicePage: async (params: any) => {
    return await request.get({ url: `/agriculture/water-source-device/page`, params });
  },

  // 查询水源-设备关联详情
  getWaterSourceDevice: async (id: number) => {
    return await request.get({ url: `/agriculture/water-source-device/get?id=` + id });
  },

  // 新增水源-设备关联
  createWaterSourceDevice: async (data: WaterSourceDeviceVO) => {
    return await request.post({ url: `/agriculture/water-source-device/create`, data });
  },

  // 修改水源-设备关联
  updateWaterSourceDevice: async (data: WaterSourceDeviceVO) => {
    return await request.put({ url: `/agriculture/water-source-device/update`, data });
  },

  // 删除水源-设备关联
  deleteWaterSourceDevice: async (id: number) => {
    return await request.delete({ url: `/agriculture/water-source-device/delete?id=` + id });
  },

  // 导出水源-设备关联 Excel
  exportWaterSourceDevice: async (params) => {
    return await request.download({ url: `/agriculture/water-source-device/export-excel`, params });
  },

  // 根据水源id查询已绑定设备信息
  selectDeviceListByWsId: async (wsId: string) => {
    return await request.get({ url: `/agriculture/water-source-device/deviceList?wsId=` + wsId });
  },

  // 删除水源设备的绑定
  deleteBindRecordByWsIdAndDeviceId: async (wsId: any, deviceId: any) => {
    return await request.get({
      url: `/agriculture/water-source-device/deleteByWsIdAndDeviceId?wsId=${wsId}&deviceId=${deviceId}`
    });
  },

  // 根据水源id查询已绑定设备的id
  selectBindDeviceIdByWsId: async (wsId: string) => {
    return await request.get({ url: `/agriculture/water-source-device/deviceIdList?wsId=` + wsId });
  },

  // 绑定设备
  WsBindDevice: async (data: WsAndDeviceDTO) => {
    return await request.post({ url: `/agriculture/water-source-device/wsBindDevice`, data });
  }
};
