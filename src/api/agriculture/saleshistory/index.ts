import request from '@/config/axios';

// 销售历史记录 VO
export interface SalesHistoryVO {
  id: string; // 主键
  productName: string; // 产品名称
  price: string; // 价格
  saleDate: Date; // 时间
  quantitySold: string; // 销售数量
  salesperson: string; // 销售员
  remarks: string; // 备注
}

// 销售历史记录 API
export const SalesHistoryApi = {
  // 查询销售历史记录分页
  getSalesHistoryPage: async (params: any) => {
    return await request.get({ url: `/agriculture/sales-history/page`, params });
  },

  // 查询销售历史记录详情
  getSalesHistory: async (id: number) => {
    return await request.get({ url: `/agriculture/sales-history/get?id=` + id });
  },

  // 新增销售历史记录
  createSalesHistory: async (data: SalesHistoryVO) => {
    return await request.post({ url: `/agriculture/sales-history/create`, data });
  },

  // 修改销售历史记录
  updateSalesHistory: async (data: SalesHistoryVO) => {
    return await request.put({ url: `/agriculture/sales-history/update`, data });
  },

  // 删除销售历史记录
  deleteSalesHistory: async (id: number) => {
    return await request.delete({ url: `/agriculture/sales-history/delete?id=` + id });
  },

  // 导出销售历史记录 Excel
  exportSalesHistory: async (params) => {
    return await request.download({ url: `/agriculture/sales-history/export-excel`, params });
  }
};
