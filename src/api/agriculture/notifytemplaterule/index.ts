import request from '@/config/axios';

// 模板规则中间 VO
export interface NotifyTemplateRuleVO {
  id: string; // 主键
  templateId: number; // 模板id
  tableId: string; // 表id
  ruleId: string; // 规则id
}

//预警规则绑定模板
export interface WarnRuleBindTemplateDTO {
  ruleId: string; // 预警规则id
  templateIds: string[]; // 模板id
}

//农事计划绑定模板
export interface FarmPlanBindTemplateDTO {
  planId: string; // 农事计划id
  templateIds: string[]; // 模板id
}

// 模板规则中间 API
export const NotifyTemplateRuleApi = {
  // 查询模板规则中间分页
  getNotifyTemplateRulePage: async (params: any) => {
    return await request.get({ url: `/agriculture/notify-template-rule/page`, params });
  },

  // 查询模板规则中间详情
  getNotifyTemplateRule: async (id: number) => {
    return await request.get({ url: `/agriculture/notify-template-rule/get?id=` + id });
  },

  // 新增模板规则中间
  createNotifyTemplateRule: async (data: NotifyTemplateRuleVO) => {
    return await request.post({ url: `/agriculture/notify-template-rule/create`, data });
  },

  // 修改模板规则中间
  updateNotifyTemplateRule: async (data: NotifyTemplateRuleVO) => {
    return await request.put({ url: `/agriculture/notify-template-rule/update`, data });
  },

  // 删除模板规则中间
  deleteNotifyTemplateRule: async (id: number) => {
    return await request.delete({ url: `/agriculture/notify-template-rule/delete?id=` + id });
  },

  // 导出模板规则中间 Excel
  exportNotifyTemplateRule: async (params) => {
    return await request.download({
      url: `/agriculture/notify-template-rule/export-excel`,
      params
    });
  },

  // 预警规则绑定模板
  WarnRuleBindTemplate: async (data: WarnRuleBindTemplateDTO) => {
    return await request.post({ url: `/agriculture/notify-template-rule/bind`, data });
  },

  // 农事计划绑定模板
  FarmPlanBindTemplate: async (data: FarmPlanBindTemplateDTO) => {
    return await request.post({ url: `/agriculture/notify-template-rule/bindPlan`, data });
  },

  // 根据预警规则查询模板id
  selectTemplateIdByRuleId: async (tableId: string, ruleId: string) => {
    return await request.get({
      url: `/agriculture/notify-template-rule/templateList`,
      params: {
        tableId,
        ruleId
      }
    });
  }
};
