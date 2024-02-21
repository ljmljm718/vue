import request from '@/config/axios'

// 测试 VO
export interface TestVO {
  id: number // 主键
  name: string // 姓名
  age: Date // 年龄
  sex: boolean // 性别
  height: number // 身高
}

// 测试 API
export const TestApi = {
  // 查询测试分页
  getTestPage: async (params: any) => {
    return await request.get({ url: `/kaizhou/test/page`, params })
  },

  // 查询测试详情
  getTest: async (id: number) => {
    return await request.get({ url: `/kaizhou/test/get?id=` + id })
  },

  // 新增测试
  createTest: async (data: TestVO) => {
    return await request.post({ url: `/kaizhou/test/create`, data })
  },

  // 修改测试
  updateTest: async (data: TestVO) => {
    return await request.put({ url: `/kaizhou/test/update`, data })
  },

  // 删除测试
  deleteTest: async (id: number) => {
    return await request.delete({ url: `/kaizhou/test/delete?id=` + id })
  },

  // 导出测试 Excel
  exportTest: async (params) => {
    return await request.download({ url: `/kaizhou/test/export-excel`, params })
  },
}