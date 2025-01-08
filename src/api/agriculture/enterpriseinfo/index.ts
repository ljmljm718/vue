import request from '@/config/axios';

// 企业信息 VO
export interface EnterpriseInfoVO {
  id: string; // 主键
  enterpriseName: string; // 企业名称
  address: string; // 详细地址
  postCode: string; // 邮政编码
  longitude: string; // 经度
  latitude: string; // 纬度
  contactPerson: string; // 联系人
  contactNumber: string; // 联系电话
}

// 企业信息 API
export const EnterpriseInfoApi = {
  // 查询企业信息分页
  getEnterpriseInfoPage: async (params: any) => {
    return await request.get({ url: `/basic/enterprise-info/page`, params });
  },

  // 查询企业信息详情
  getEnterpriseInfo: async (id: number) => {
    return await request.get({ url: `/basic/enterprise-info/get?id=` + id });
  },

  // 新增企业信息
  createEnterpriseInfo: async (data: EnterpriseInfoVO) => {
    return await request.post({ url: `/basic/enterprise-info/create`, data });
  },

  // 修改企业信息
  updateEnterpriseInfo: async (data: EnterpriseInfoVO) => {
    return await request.put({ url: `/basic/enterprise-info/update`, data });
  },

  // 删除企业信息
  deleteEnterpriseInfo: async (id: number) => {
    return await request.delete({ url: `/basic/enterprise-info/delete?id=` + id });
  },

  // 导出企业信息 Excel
  exportEnterpriseInfo: async (params) => {
    return await request.download({ url: `/basic/enterprise-info/export-excel`, params });
  }
};
