import request from '@/config/axios';

// 鲁渝协作预警规则 VO
export interface AgriWarningRuleVO {
  id: number; // 主键
  warnLowValue: string; // 预警下限
  warnHighValue: string; // 预警上限
  warnUnit: string; // 单位
  lowMsg: string; // 低位预警
  highMsg: string; // 高位预警
  responsiblePersonId: string; // 责任人编号
  responsiblePerson: string; // 责任人
  remark: string; // 备注
  warnType: string; // 预警类型
  effectiveStatus: string; // 生效状态（0-未生效，1-生效）
  ruleTitle: string; // 规则标题
}

// 鲁渝协作预警规则 API
export const AgriWarningRuleApi = {
  // 查询鲁渝协作预警规则分页
  getAgriWarningRulePage: async (params: any) => {
    return await request.get({ url: `/agriculture/agri-warning-rule/page`, params });
  },

  // 查询鲁渝协作预警规则详情
  getAgriWarningRule: async (id: number) => {
    return await request.get({ url: `/agriculture/agri-warning-rule/get?id=` + id });
  },

  // 新增鲁渝协作预警规则
  createAgriWarningRule: async (data: AgriWarningRuleVO) => {
    return await request.post({ url: `/agriculture/agri-warning-rule/create`, data });
  },

  // 修改鲁渝协作预警规则
  updateAgriWarningRule: async (data: AgriWarningRuleVO) => {
    return await request.put({ url: `/agriculture/agri-warning-rule/update`, data });
  },

  // 删除鲁渝协作预警规则
  deleteAgriWarningRule: async (id: number) => {
    return await request.delete({ url: `/agriculture/agri-warning-rule/delete?id=` + id });
  },

  // 导出鲁渝协作预警规则 Excel
  exportAgriWarningRule: async (params) => {
    return await request.download({ url: `/agriculture/agri-warning-rule/export-excel`, params });
  },

  // 获得所有设备监测类型
  getAllMonitorType: async () => {
    return await request.get({ url: `/agriculture/agri-warning-rule/getAllMonitorType` });
  },

  // 根据子表监测类型获取主表设备
  getDeviceByMonitorType: async (params: any) => {
    return await request.get({
      url: `/agriculture/agri-warning-rule/getDeviceByMonitorType`,
      params
    });
  }
};
