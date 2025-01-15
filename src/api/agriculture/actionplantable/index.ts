import request from '@/config/axios';

// 方案动作 VO
export interface ActionPlanTableVO {
  id: number; // 主键
  actionId: string; // 动作ID
  actionContent: string; // 动作内容
  actionName: string; // 动作名称
  actionType: string; // 动作类型
  url: string; // URL
  requestParams: string; // 请求参数
  sortOrder: number; // 排序
}

// 方案动作 API
export const ActionPlanTableApi = {
  // 查询方案动作分页
  getActionPlanTablePage: async (params: any) => {
    return await request.get({ url: `/agriculture/action-plan-table/page`, params });
  },

  // 查询方案动作详情
  getActionPlanTable: async (id: number) => {
    return await request.get({ url: `/agriculture/action-plan-table/get?id=` + id });
  },

  // 新增方案动作
  createActionPlanTable: async (data: ActionPlanTableVO) => {
    return await request.post({ url: `/agriculture/action-plan-table/create`, data });
  },

  // 修改方案动作
  updateActionPlanTable: async (data: ActionPlanTableVO) => {
    return await request.put({ url: `/agriculture/action-plan-table/update`, data });
  },

  // 删除方案动作
  deleteActionPlanTable: async (id: number) => {
    return await request.delete({ url: `/agriculture/action-plan-table/delete?id=` + id });
  },

  // 导出方案动作 Excel
  exportActionPlanTable: async (params) => {
    return await request.download({ url: `/agriculture/action-plan-table/export-excel`, params });
  }
};
