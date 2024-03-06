import request from '@/config/axios'

// 农事定义 VO
export interface FarmWorkDefineVO {
  id: string // 主键
  workCode: string // 农事定义编码
  workType: string // 农事阶段
  workRemark: string // 农事描述
}

// 农事定义 API
export const FarmWorkDefineApi = {
  // 查询农事定义分页
  getFarmWorkDefinePage: async (params: any) => {
    return await request.get({ url: `/kaizhou/farm-work-define/page`, params })
  },

  // 查询农事定义详情
  getFarmWorkDefine: async (id: number) => {
    return await request.get({ url: `/kaizhou/farm-work-define/get?id=` + id })
  },

  // 新增农事定义
  createFarmWorkDefine: async (data: FarmWorkDefineVO) => {
    return await request.post({ url: `/kaizhou/farm-work-define/create`, data })
  },

  // 修改农事定义
  updateFarmWorkDefine: async (data: FarmWorkDefineVO) => {
    return await request.put({ url: `/kaizhou/farm-work-define/update`, data })
  },

  // 删除农事定义
  deleteFarmWorkDefine: async (id: number) => {
    return await request.delete({ url: `/kaizhou/farm-work-define/delete?id=` + id })
  },

  // 导出农事定义 Excel
  exportFarmWorkDefine: async (params) => {
    return await request.download({ url: `/kaizhou/farm-work-define/export-excel`, params })
  },
}
