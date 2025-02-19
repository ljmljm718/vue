import request from '@/config/axios';

// 模版中间 VO
export interface TemplateIntermediateTableVO {
  id: number; // 主键
  actionId: string; // 动作ID
  templateId: string; // 模版ID
}

// 模版中间 API
export const TemplateIntermediateTableApi = {
  // 查询模版中间分页
  getTemplateIntermediateTablePage: async (params: any) => {
    return await request.get({ url: `/agriculture/template-intermediate-table/page`, params });
  },

  // 查询模版中间详情
  getTemplateIntermediateTable: async (id: number) => {
    return await request.get({ url: `/agriculture/template-intermediate-table/get?id=` + id });
  },

  // 新增模版中间
  createTemplateIntermediateTable: async (data: TemplateIntermediateTableVO) => {
    return await request.post({ url: `/agriculture/template-intermediate-table/create`, data });
  },
  // 新增模版中间
  createBatchTemplateIntermediateTable: async (actionIds: string[], templateId: string) => {
    return await request.get({
      url:
        `/agriculture/template-intermediate-table/create-batch?actionIds=` +
        actionIds +
        `&templateId=` +
        templateId
    });
  },

  // 修改模版中间
  updateTemplateIntermediateTable: async (data: TemplateIntermediateTableVO) => {
    return await request.put({ url: `/agriculture/template-intermediate-table/update`, data });
  },

  // 删除模版中间
  deleteTemplateIntermediateTable: async (id: number) => {
    return await request.delete({
      url: `/agriculture/template-intermediate-table/delete?id=` + id
    });
  },

  // 导出模版中间 Excel
  exportTemplateIntermediateTable: async (params) => {
    return await request.download({
      url: `/agriculture/template-intermediate-table/export-excel`,
      params
    });
  },

  // 根据模板id查询方案编号
  getActionIdByTemplateId: async (templateId: number) => {
    return await request.get({
      url: `/agriculture/template-intermediate-table/get-action-id?templateId=` + templateId
    });
  }
};
