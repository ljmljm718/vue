import request from '@/config/axios'

// 鲁渝协作设备分类 VO
export interface DeviceCategoryVO {
  id: number // id主键
  parentId: number // 父结点id（第一级父结点是0，自关联字段id）
  categoryCode: string // 分类编码
  categoryName: string // 分类名称
  categoryLabel: string // 分类标签，默认和名称一样
  showStatus: number // 是否显示
  categorySort: number // 分类排序
  imgId: string // 图片
  description: string // 描述
  deptId: number // 部门id
  userId: number // 用户id
}

// 鲁渝协作设备分类 API
export const DeviceCategoryApi = {
  // 查询鲁渝协作设备分类列表
  getDeviceCategoryList: async (params) => {
    return await request.get({ url: `/agriculture/device-category/list`, params })
  },

  // 查询鲁渝协作设备分类详情
  getDeviceCategory: async (id: number) => {
    return await request.get({ url: `/agriculture/device-category/get?id=` + id })
  },

  // 新增鲁渝协作设备分类
  createDeviceCategory: async (data: DeviceCategoryVO) => {
    return await request.post({ url: `/agriculture/device-category/create`, data })
  },

  // 修改鲁渝协作设备分类
  updateDeviceCategory: async (data: DeviceCategoryVO) => {
    return await request.put({ url: `/agriculture/device-category/update`, data })
  },

  // 删除鲁渝协作设备分类
  deleteDeviceCategory: async (id: number) => {
    return await request.delete({ url: `/agriculture/device-category/delete?id=` + id })
  },

  // 导出鲁渝协作设备分类 Excel
  exportDeviceCategory: async (params) => {
    return await request.download({ url: `/agriculture/device-category/export-excel`, params })
  },
}
