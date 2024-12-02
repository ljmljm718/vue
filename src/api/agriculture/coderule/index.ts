import request from '@/config/axios';

// 码规则 VO
export interface CodeRuleVO {
  id: string; // id
  codeName: string; // 源码名称
  categoryId: string; // 品类id
  codeBefore: string; // 码前缀
  codeDate: string; // 日期
  codeSerial: string; // 序列号
  remark: string; // 备注
}

// 码规则 API
export const CodeRuleApi = {
  // 查询码规则分页
  getCodeRulePage: async (params: any) => {
    return await request.get({ url: `/agriculture/code-rule/page`, params });
  },

  // 查询码规则全部
  getCodeRuleAll: async (params: any) => {
    return await request.get({ url: `/agriculture/code-rule/all`, params });
  },

  // 查询码规则详情
  getCodeRule: async (id: number) => {
    return await request.get({ url: `/agriculture/code-rule/get?id=` + id });
  },

  // 新增码规则
  createCodeRule: async (data: CodeRuleVO) => {
    return await request.post({ url: `/agriculture/code-rule/create`, data });
  },

  // 修改码规则
  updateCodeRule: async (data: CodeRuleVO) => {
    return await request.put({ url: `/agriculture/code-rule/update`, data });
  },

  // 删除码规则
  deleteCodeRule: async (id: number) => {
    return await request.delete({ url: `/agriculture/code-rule/delete?id=` + id });
  },

  // 导出码规则 Excel
  exportCodeRule: async (params) => {
    return await request.download({ url: `/agriculture/code-rule/export-excel`, params });
  },

  // 验证前缀是否重复
  codeBeforeRep: async (codeBefore: string, id: string) => {
    return await request.get({
      url: `/agriculture/code-rule/codeBeforeRep?codeBefore=` + codeBefore + '&id=' + id
    });
  }
};
